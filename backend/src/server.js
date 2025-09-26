// =================================================================
//                      Imports & Configuration
// =================================================================
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB, checkDBHealth } from './db.js';
import logger from './utils/logger.js';

// === CRITICAL FIX: IMPORT YOUR ROUTE FILES ===
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
// ===========================================

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// =================================================================
//                  Database Connection & Middleware
// =================================================================
const initializeDatabase = async () => {
  try {
    await connectDB();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to initialize database connection:', error);
    process.exit(1);
  }
};

// ... (Rest of Middleware remains the same) ...

app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'https://righttechcentre.vercel.app',
  'http://localhost:5000',
  'http://localhost:3000'
];

if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
}));

app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

// =================================================================
//                  SIMPLE GUARANTEED ROUTES (NO IMPORTS)
// =================================================================
console.log('=== SETTING UP GUARANTEED ROUTES ===');

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbHealth.status
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});

// Root endpoint with ALL available routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Right Tech Centre API Server - WORKING!',
    version: '1.0.0',
    endpoints: {
      // Guaranteed to work
      health: 'GET /health',
      apiTest: 'GET /api/test',
      
      // Actual application routes
      auth: '/api/auth/*',
      users: '/api/users/*', 
      courses: '/api/courses/*',
      admin: '/api/admin/*',
      payments: '/api/payments/*'
    }
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is definitely working!',
    timestamp: new Date().toISOString()
  });
});

// =================================================================
//                  MOUNT ACTUAL APPLICATION ROUTES (THE FIX!)
// =================================================================
console.log('=== MOUNTING APPLICATION ROUTES ===');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

console.log('=== ALL ROUTES MOUNTED SUCCESSFULLY ===');


// =================================================================
//                  Error Handling
// =================================================================
// 404 handler for any unhandled endpoint
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    path: req.originalUrl,
    suggestion: 'Visit / for available endpoints'
  });
});

app.use((error, req, res, next) => {
  logger.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

// =================================================================
//                  Server Initialization
// =================================================================
const startServer = async () => {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log('📍 ALL APPLICATION ROUTES ARE NOW ACTIVE.');
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(() => {
        mongoose.connection.close();
        console.log('Server stopped');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
