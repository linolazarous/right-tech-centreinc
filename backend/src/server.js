require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const https = require('https');
const cluster = require('cluster');
const os = require('os');
const timeout = require('connect-timeout');

// Import configurations and utilities
const db = require('./db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const logger = require('./utils/logger');

// Import all routes
const routes = require('./routes'); // Consolidated routes

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(apiLimiter);

// Special rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts, please try again later'
});

// Standard Middleware
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('combined', { stream: logger.stream }));
app.use(timeout('30s'));
app.use((req, res, next) => {
  res.set('X-Powered-By', 'Right Tech Centre');
  next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
})
.then(() => logger.info('MongoDB Connected'))
.catch(err => logger.error('MongoDB Connection Error:', err));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});

// API Routes
app.use('/api/auth', authLimiter, routes.authRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/courses', routes.courseRoutes);
// Add all other routes following the same pattern...

// Special protected routes
app.use('/api/badges', authMiddleware, routes.badgeRoutes);
app.use('/api/leaderboard', authMiddleware, routes.leaderboardRoutes);

// Static Files (if needed)
app.use('/public', express.static('public', {
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.gz')) {
      res.set('Content-Encoding', 'gzip');
    }
  }
}));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
    code: 404
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
      errors: err.errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }

  // Handle rate limit errors
  if (err instanceof rateLimit.RateLimitError) {
    return res.status(429).json({
      status: 'fail',
      message: 'Too many requests, please try again later'
    });
  }

  // Generic error response
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Server Setup
const PORT = process.env.PORT || 5500;
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

let server;
if (SSL_ENABLED && process.env.NODE_ENV === 'production') {
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : null
  };
  server = https.createServer(sslOptions, app).listen(PORT, () => {
    logger.info(`HTTPS Server running on port ${PORT}`);
  });
} else {
  server = app.listen(PORT, () => {
    logger.info(`HTTP Server running on port ${PORT}`);
  });
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Cluster Mode (Production Only)
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  logger.info(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });
} else {
  // Worker process
  logger.info(`Worker ${process.pid} started`);
        }
