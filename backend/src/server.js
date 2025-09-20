// backend/src/server.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import routes
import { authRoutes, userRoutes, adminRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ==============================================
// Environment Configuration
// ==============================================
const isProduction = process.env.NODE_ENV === 'production';

// ==============================================
// Middleware
// ==============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration - FIXED
const allowedOrigins = [
  'https://righttechcentre.vercel.app', // Your Vercel frontend
  'http://localhost:3000',
  'http://localhost:5173'
];

if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
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
// Root Route - ADD THIS TO FIX "cannot GET /"
// ==============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Right Tech Centre API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    docs: '/api/test for test endpoint',
    health: '/health for health check'
  });
});

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
    version: '1.0.0'
  });
});

// ==============================================
// API Routes
// ==============================================
// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test working', 
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

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
  
  // CORS error handling
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS error: Origin not allowed',
      allowedOrigins: allowedOrigins
    });
  }
  
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
  console.log(`📍 API Root: http://localhost:${PORT}/`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Allowed Origins: ${allowedOrigins.join(', ')}`);
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
