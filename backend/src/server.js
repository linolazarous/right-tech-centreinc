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

const app = express();
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

// =================================================================
//                  Security & Performance Middleware
// =================================================================
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'https://righttechcentre.vercel.app',
  'http://localhost:5000'
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
//                  Health Check & Status Endpoints
// =================================================================
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    const status = dbHealth.status === 'healthy' ? 200 : 503;
    res.status(status).json({
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      uptime: process.uptime(),
      database: dbHealth
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Right Tech Centre API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working' 
  });
});

// =================================================================
//                  ACTUAL AUTHENTICATION SYSTEM
// =================================================================
console.log('=== LOADING ACTUAL AUTH SYSTEM ===');

// Import the actual authController functions directly
let authController;
try {
  authController = await import('./controllers/authController.js');
  console.log('✅ authController loaded successfully');
} catch (error) {
  console.log('❌ Failed to load authController:', error);
  process.exit(1);
}

// Create auth routes using the actual controller functions
const authRouter = express.Router();

// Public routes
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/login/verify-2fa', authController.verify2FALogin);

// Add a test route
authRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Actual auth system is working!' });
});

// Mount the auth routes
app.use('/api/auth', authRouter);
console.log('✅ Actual auth system mounted at /api/auth');

// =================================================================
//                  Error Handling
// =================================================================
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'Origin not allowed' 
    });
  }
  
  res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : error.message
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
      console.log('📍 Actual authentication system is LIVE!');
      console.log('📍 Available endpoints:');
      console.log('   - POST /api/auth/register');
      console.log('   - POST /api/auth/login');
      console.log('   - POST /api/auth/login/verify-2fa');
      console.log('   - GET  /api/auth/test');
    });

    const gracefulShutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log('Server stopped');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
