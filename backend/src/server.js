import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// ==============================================
// Import Fixes - Check these paths exist!
// ==============================================
// Remove these imports if the files don't exist yet
// import db from './db.js';
// import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ==============================================
// Enhanced Middleware
// ==============================================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ==============================================
// Health Check Endpoint (REQUIRED for DigitalOcean)
// ==============================================
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    dbStatus,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==============================================
// Basic Routes
// ==============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==============================================
// Temporary comment out routes until files exist
// ==============================================
// app.use('/api/auth', routes.authRoutes);
// app.use('/api/users', routes.userRoutes);

// Add a simple test route to verify API works
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working',
    data: { timestamp: new Date().toISOString() }
  });
});

// ==============================================
// Database Connection
// ==============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/righttechcentre';

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, mongoOptions);
    console.log('✅ MongoDB Connected successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit process in production, let it try to reconnect
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
};

connectDB();

// MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

// ==============================================
// Error Handling Middleware
// ==============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// ==============================================
// Start Server (CRITICAL FIX FOR DIGITALOCEAN)
// ==============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API test: http://localhost:${PORT}/api/test`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    console.log('Process terminated');
  });
});

// Export for testing
export default app;
