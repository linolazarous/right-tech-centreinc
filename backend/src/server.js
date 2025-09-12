import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import { authRoutes, userRoutes, adminRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ==============================================
// Middleware
// ==============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
      },
    },
  })
);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ==============================================
// Database Connection (MongoDB)
// ==============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/righttechcentre';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// ==============================================
// Health Check
// ==============================================
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({
    status: 'UP',
    dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==============================================
// API Routes (must be defined before the frontend catch-all)
// ==============================================

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API test working', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ==============================================
// Serve React Frontend (Production)
// ==============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

// Serve static files
app.use(express.static(publicPath));

// Admin dashboard route (served by backend)
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Admin Dashboard - Right Tech Centre</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">User Management</h2>
              <p class="text-gray-600">Manage platform users and permissions</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">Course Management</h2>
              <p class="text-gray-600">Create and manage courses</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">Analytics</h2>
              <p class="text-gray-600">View platform statistics</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Catch-all handler for React routing
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next(err);
    }
  });
});

// ==============================================
// Error Handling
// ==============================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// ==============================================
// Start Server
// ==============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Admin Dashboard: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    console.log('Server stopped');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    console.log('Server stopped');
    process.exit(0);
  });
});

export default app;
