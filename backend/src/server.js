import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import { body, validationResult } from 'express-validator';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import cluster from 'cluster';
import os from 'os';
import timeout from 'connect-timeout';

// Import configurations and utilities
import db from './db.js';
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';
import logger from './utils/logger.js';
import routes from './routes/index.js'; // Consolidated routes

// Initialize Express app
const app = express();

// ==============================================
// Security Configuration
// ==============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", process.env.API_BASE_URL || '']
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));

// ==============================================
// Rate Limiting Strategies
// ==============================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Higher limit for DO infrastructure
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1' // Skip for health checks
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts, please try again later',
  skip: (req) => req.path.includes('/verify') // Skip for verification routes
});

// Apply rate limiting
app.use(generalLimiter);
app.use('/api/auth', authLimiter);

// ==============================================
// Performance Middleware
// ==============================================
app.use(compression({
  level: 6,
  threshold: '10kb',
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(timeout('30s'));

// Enhanced logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: logger.stream,
  skip: (req) => req.path === '/health'
}));

// Security headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// ==============================================
// Database Connection
// ==============================================
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 10000, // Increased timeout for cloud
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 15, // Adjusted for DO
  minPoolSize: 3
};

mongoose.connect(process.env.MONGO_URI || db.mongoURI, mongoOptions)
  .then(() => logger.info('✅ MongoDB Connected'))
  .catch(err => {
    logger.error('❌ MongoDB Connection Error:', err);
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => process.exit(1), 5000); // Graceful exit with delay
    }
  });

// ==============================================
// Health Check Endpoint
// ==============================================
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    dbStatus,
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
    },
    uptime: process.uptime()
  });
});

// ==============================================
// API Routes
// ==============================================
app.use('/api/auth', routes.authRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/courses', routes.courseRoutes);
app.use('/api/badges', authMiddleware, routes.badgeRoutes);
app.use('/api/leaderboard', authMiddleware, routes.leaderboardRoutes);
// Add all other routes...

// ==============================================
// Static Files and 404 Handler
// ==============================================
app.use('/public', express.static('public', {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.br')) {
      res.set('Content-Encoding', 'br');
    } else if (path.endsWith('.gz')) {
      res.set('Content-Encoding', 'gzip');
    }
  }
}));

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
    code: 404
  });
});

// ==============================================
// Error Handling
// ==============================================
app.use(errorHandler);

// ==============================================
// Server Initialization
// ==============================================
const PORT = process.env.PORT || 8080; // DO standard port
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

const startServer = () => {
  let server;
  
  if (SSL_ENABLED && process.env.NODE_ENV === 'production') {
    const sslOptions = {
      key: readFileSync(process.env.SSL_KEY_PATH),
      cert: readFileSync(process.env.SSL_CERT_PATH),
      ca: process.env.SSL_CA_PATH ? readFileSync(process.env.SSL_CA_PATH) : null
    };
    server = createServer(sslOptions, app).listen(PORT, () => {
      logger.info(`🚀 HTTPS Server running on port ${PORT}`);
    });
  } else {
    server = app.listen(PORT, () => {
      logger.info(`🚀 HTTP Server running on port ${PORT}`);
    });
  }

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.warn(`Received ${signal}, shutting down gracefully...`);
    
    server.close(() => {
      logger.info('Server closed');
      mongoose.connection.close(false)
        .then(() => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        })
        .catch(err => {
          logger.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
    });

    // Force shutdown if not completed in 10s
    setTimeout(() => {
      logger.error('Forcing shutdown...');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    shutdown('UNHANDLED_REJECTION');
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    shutdown('UNCAUGHT_EXCEPTION');
  });
};

// Cluster mode (Production only)
if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  logger.info(`👑 Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`💀 Worker ${worker.process.pid} died (${signal || code})`);
    if (!worker.exitedAfterDisconnect) {
      logger.info('🌀 Starting a new worker...');
      cluster.fork();
    }
  });
} else {
  startServer();
}
