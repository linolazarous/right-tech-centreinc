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

// FIXED: Import routes correctly - use default imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';

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
    process.exit(1);
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
  maxAge: 86400
}));

// =================================================================
//                  Performance & Body Parsing Middleware
// =================================================================
app.use(compression({ level: 6, threshold: 1024 }));

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

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =================================================================
//                  Rate Limiting
// =================================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// =================================================================
//                  Request Logging
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
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin'
    },
    environment: process.env.NODE_ENV
  });
});

// =================================================================
//                  API Routes - FIXED MOUNTING
// =================================================================
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is functioning correctly', 
    timestamp: new Date().toISOString()
  });
});

// Mount API routes - CORRECT ORDER
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

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
      console.log(`📍 Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
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

// Start the server
startServer();

export default app;

