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
import { connectDB, checkDBHealth } from './db.js'; // Updated import
import logger from './utils/logger.js';

// Import routes
import { authRoutes, userRoutes, adminRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// =================================================================
//                  Database Connection
// =================================================================
const initializeDatabase = async () => {
  try {
    await connectDB();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to initialize database connection:', error);
    process.exit(1); // Exit if database connection fails
  }
};

// =================================================================
//                  Security Middleware
// =================================================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// =================================================================
//                  CORS Configuration
// =================================================================
const allowedOrigins = [
  'https://righttechcentre.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin && isProduction) {
      return callback(new Error('Origin required in production'), false);
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}));

// =================================================================
//                  Performance & Body Parsing Middleware
// =================================================================
app.use(compression({
  level: 6,
  threshold: 1024
}));

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON payload');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// =================================================================
//                  Rate Limiting
// =================================================================
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { success: false, message },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1' // Skip for localhost
});

// General API rate limiting
app.use(createRateLimit(15 * 60 * 1000, 200, 'Too many requests, please try again later.'));

// Stricter limits for auth routes
const authLimiter = createRateLimit(15 * 60 * 1000, 10, 'Too many authentication attempts, please try again later.');
app.use('/api/auth', authLimiter);

// =================================================================
//                  Request Logging & Monitoring
// =================================================================
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
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
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
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
    endpoints: {
      docs: '/api/test',
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin'
    },
    environment: process.env.NODE_ENV
  });
});

// =================================================================
//                  API Routes
// =================================================================
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is functioning correctly', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount API routes with versioning
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// =================================================================
//                  Error Handling
// =================================================================
// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // CORS error
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'Origin not allowed',
      allowedOrigins
    });
  }

  // JSON parsing error
  if (error.message === 'Invalid JSON payload') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON in request body' 
    });
  }

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
      message: 'Duplicate entry found' 
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: isProduction ? 'Internal server error' : error.message,
    ...(!isProduction && { stack: error.stack })
  });
});

// =================================================================
//                  Server Initialization
// =================================================================
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform
      });
      
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📍 API Root: http://localhost:${PORT}/`);
      console.log(`📍 Health Check: http://localhost:${PORT}/health`);
      console.log(`📍 Allowed Origins: ${allowedOrigins.join(', ')}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      server.close(async (err) => {
        if (err) {
          logger.error('Error during server close:', err);
          process.exit(1);
        }
        
        try {
          await mongoose.connection.close();
          logger.info('Database connection closed gracefully');
          logger.info('Server shutdown completed');
          process.exit(0);
        } catch (dbError) {
          logger.error('Error closing database connection:', dbError);
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
