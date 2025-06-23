// Import 'dotenv/config' first to ensure environment variables are loaded immediately
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
import db from './db.js'; // Assuming db.js contains your MONGO_URI if not in .env
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';
import logger from './utils/logger.js';
import routes from './routes/index.js'; // Consolidated routes

// Initialize Express app
const app = express();

// ==============================================
// Global Security Configuration (Applied to all routes)
// ==============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      // Connect to your own API_BASE_URL and potentially other external services if needed
      connectSrc: ["'self'", process.env.API_BASE_URL || '', 'https://fonts.gstatic.com'],
      // Frame ancestors should typically be 'none' or specific domains for security
      frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration - Define once
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://yourwebapp.com',
  'capacitor://localhost',  // For iOS Capacitor apps
  'http://localhost',       // For Android Capacitor apps and local development
  // Add other local development origins as needed, e.g., 'http://localhost:3000' for a React app
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Mobile-Api-Key', 'X-Device-Id'],
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
};
app.use(cors(corsOptions));


// ==============================================
// General Performance & Parsing Middleware
// ==============================================
app.use(compression({
  level: 6, // Optimal balance between compression and CPU usage
  threshold: '10kb', // Only compress responses larger than 10KB
  filter: (req, res) => {
    // Skip compression if client explicitly requests it (e.g., for certain file types)
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Parse JSON and URL-encoded data with payload limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Set a global request timeout
app.use(timeout('30s')); // 30 seconds timeout for all requests

// Enhanced logging with Morgan
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: logger.stream, // Pipe logs to your custom logger
  skip: (req) => req.path === '/health' // Skip health check logs
}));

// Custom Security Headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By'); // Hide Express
  res.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
  res.set('X-Frame-Options', 'DENY'); // Prevent clickjacking
  res.set('X-XSS-Protection', '1; mode=block'); // Enable XSS protection
  // HSTS: Enforce HTTPS for a long duration, include subdomains, and preload
  res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// ==============================================
// Rate Limiting Strategies
// ==============================================

// General API rate limiter (applied to non-auth, non-mobile routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per 15 minutes per IP
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skip: (req) => req.ip === '127.0.0.1' || req.path.startsWith('/mobile/') // Skip for health checks and mobile routes
});

// Authentication-specific rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per 15 minutes per IP for auth routes
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.includes('/verify') // Skip for verification routes
});

// ==============================================
// Mobile-Specific Middleware & Rate Limiting
// ==============================================

// Mobile API Key Authentication Middleware
const mobileAuthMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-mobile-api-key'];

  if (!apiKey || apiKey !== process.env.MOBILE_API_KEY) {
    logger.warn(`Attempted mobile access with invalid API key from ${req.ip}`);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid mobile API key.',
      code: 401
    });
  }
  // Indicate that this is a mobile request
  req.mobileRequest = true;
  next();
};

// Mobile-specific rate limiter (more generous)
const mobileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for mobile apps
  // Key generation based on device ID for mobile, fallback to IP
  keyGenerator: (req) => {
    return req.mobileRequest && req.headers['x-device-id'] ? req.headers['x-device-id'] : req.ip;
  },
  message: 'Too many requests from this mobile device, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.includes('/health') // Skip for health checks
});

// ==============================================
// Database Connection
// ==============================================
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true, // Enable retryable writes
  w: 'majority', // Write concern: ensure write operations propagate to majority of replica set members
  serverSelectionTimeoutMS: 10000, // How long to wait for server selection (e.g., finding a primary)
  socketTimeoutMS: 45000, // How long a send or receive on a socket can take
  connectTimeoutMS: 10000, // How long to wait for a connection to be established
  maxPoolSize: 15, // Maximum number of connections in the connection pool
  minPoolSize: 3 // Minimum number of connections in the connection pool
};

mongoose.connect(process.env.MONGO_URI || db.mongoURI, mongoOptions)
  .then(() => logger.info('✅ MongoDB Connected'))
  .catch(err => {
    logger.error('❌ MongoDB Connection Error:', err);
    // In production, exit to allow process manager (e.g., PM2, Docker, App Platform) to restart
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => process.exit(1), 5000); // Graceful exit with delay
    }
  });

// ==============================================
// Health Check Endpoint (No middleware applied)
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
    uptime: process.uptime() // Node.js process uptime in seconds
  });
});

// ==============================================
// API Routes Grouping and Application
// ==============================================

// Apply general rate limiting to all routes by default, unless overridden later
app.use(generalLimiter);

// Web API Routes
// Apply authLimiter specifically to authentication routes
app.use('/api/auth', authLimiter, routes.authRoutes);
app.use('/api/users', routes.userRoutes); // Assuming these might have their own auth if needed
app.use('/api/courses', routes.courseRoutes);
app.use('/api/badges', authMiddleware, routes.badgeRoutes); // Requires general auth
app.use('/api/leaderboard', authMiddleware, routes.leaderboardRoutes); // Requires general auth

// Mobile API Routes (New versions, specific middleware)
// These routes will first pass through mobileLimiter, then mobileAuthMiddleware
app.use('/mobile/v1/auth', mobileLimiter, mobileAuthMiddleware, routes.mobileAuthRoutes);
app.use('/mobile/v1/users', mobileLimiter, mobileAuthMiddleware, routes.mobileUserRoutes);
app.use('/mobile/v1/courses', mobileLimiter, mobileAuthMiddleware, routes.mobileCourseRoutes);
app.use('/mobile/v1/content', mobileLimiter, mobileAuthMiddleware, routes.contentRoutes); // Assuming this is general content for mobile

// Mobile-specific configuration endpoint (requires mobile API key)
app.get('/mobile/v1/config', mobileLimiter, mobileAuthMiddleware, (req, res) => {
  res.json({
    status: 'success',
    data: {
      minAppVersion: process.env.MIN_APP_VERSION || '1.0.0', // Enforce minimum app version
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true', // Flag for app-wide maintenance
      featureFlags: {
        offlineMode: process.env.FEATURE_OFFLINE_MODE === 'true', // Example feature flag
        videoDownload: process.env.FEATURE_VIDEO_DOWNLOAD === 'true'
      },
      // You can also include dynamic content, e.g., API_BASE_URL for the app
      apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${PORT}`
    }
  });
});

// ==============================================
// Static Files and 404 Handler
// ==============================================
app.use('/public', express.static('public', {
  maxAge: '1y', // Cache static assets for 1 year
  immutable: true, // Indicate that the file will not change
  setHeaders: (res, path) => {
    // Set Content-Encoding for pre-compressed files
    if (path.endsWith('.br')) {
      res.set('Content-Encoding', 'br');
    } else if (path.endsWith('.gz')) {
      res.set('Content-Encoding', 'gzip');
    }
  }
}));

// Catch-all for undefined routes
app.use((req, res, next) => {
  // If the request timed out before reaching here, `req.timedout` will be true
  if (req.timedout) {
    return; // Response already sent by `connect-timeout`
  }
  res.status(404).json({
    status: 'error',
    message: 'Resource not found.',
    code: 404
  });
});

// ==============================================
// Global Error Handling Middleware
// ==============================================
app.use(errorHandler);

// ==============================================
// Server Initialization and Clustering
// ==============================================
const PORT = process.env.PORT || 8080; // DigitalOcean App Platform typically uses PORT
const SSL_ENABLED = process.env.SSL_ENABLED === 'true'; // Controlled by environment variable

const startServer = () => {
  let server;

  if (SSL_ENABLED && process.env.NODE_ENV === 'production') {
    // Ensure SSL paths are set in environment variables in production
    if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
      logger.error('SSL_KEY_PATH or SSL_CERT_PATH not defined for HTTPS in production.');
      process.exit(1);
    }
    const sslOptions = {
      key: readFileSync(process.env.SSL_KEY_PATH),
      cert: readFileSync(process.env.SSL_CERT_PATH),
      // CA certificate is optional but recommended if your cert is not widely trusted
      ca: process.env.SSL_CA_PATH ? readFileSync(process.env.SSL_CA_PATH) : undefined
    };
    server = createServer(sslOptions, app).listen(PORT, () => {
      logger.info(`🚀 HTTPS Server running on port ${PORT} (Worker ${process.pid})`);
    });
  } else {
    // For development or if SSL is not enabled (DO App Platform handles SSL for you)
    server = app.listen(PORT, () => {
      logger.info(`🚀 HTTP Server running on port ${PORT} (Worker ${process.pid || 'N/A'})`);
    });
  }

  // Graceful shutdown logic for both master and worker processes
  const shutdown = async (signal) => {
    logger.warn(`Received ${signal}, shutting down gracefully (Worker ${process.pid})...`);

    server.close(() => {
      logger.info(`Server closed (Worker ${process.pid}).`);
      mongoose.connection.close(false) // false means don't force close pending operations
        .then(() => {
          logger.info(`MongoDB connection closed (Worker ${process.pid}).`);
          process.exit(0); // Exit successfully
        })
        .catch(err => {
          logger.error(`Error closing MongoDB connection (Worker ${process.pid}):`, err);
          process.exit(1); // Exit with error
        });
    });

    // Force shutdown after a timeout if cleanup takes too long
    setTimeout(() => {
      logger.error(`Forcing shutdown due to timeout (Worker ${process.pid}).`);
      process.exit(1);
    }, 10000); // 10 seconds to allow connections to drain
  };

  // Listen for termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
  // Catch unhandled promise rejections and uncaught exceptions
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You might want to crash the process in production to prevent unknown state
    shutdown('UNHANDLED_REJECTION');
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    // This is a critical error, the process is in an undefined state. Restarting is best.
    shutdown('UNCUGHT_EXCEPTION');
  });
};

// Cluster mode (Production only)
// DigitalOcean App Platform manages process scaling, so clustering within the app
// might be redundant or conflict with its scaling mechanisms.
// However, if you explicitly want Node.js to manage multiple processes per container,
// this setup is valid. For simpler deployments on App Platform, you might just run
// `node server.js` directly without clustering here.
if (cluster.isPrimary && process.env.NODE_ENV === 'production' && process.env.ENABLE_CLUSTER === 'true') {
  const numCPUs = os.cpus().length;
  logger.info(`👑 Master ${process.pid} is running, forking ${numCPUs} workers.`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`💀 Worker ${worker.process.pid} died (${signal || code}).`);
    // Only fork a new worker if it didn't exit gracefully (e.g., due to an error)
    if (!worker.exitedAfterDisconnect) {
      logger.info('🌀 Starting a new worker...');
      cluster.fork();
    }
  });
} else {
  // If not primary (it's a worker) or not in production/clustering disabled
  startServer();
}

