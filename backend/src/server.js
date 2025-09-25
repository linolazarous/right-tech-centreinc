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
//                  File Existence Check
// =================================================================
console.log('🔍 Checking route files...');

let authRoutes, userRoutes, adminRoutes;

try {
  // Try to import routes with error handling
  authRoutes = (await import('./routes/authRoutes.js')).default;
  console.log('✅ authRoutes.js loaded successfully');
} catch (error) {
  console.log('❌ authRoutes.js failed to load:', error.message);
}

try {
  userRoutes = (await import('./routes/usersRoutes.js')).default;
  console.log('✅ usersRoutes.js loaded successfully');
} catch (error) {
  console.log('❌ usersRoutes.js failed to load:', error.message);
}

try {
  adminRoutes = (await import('./routes/adminRoutes.js')).default;
  console.log('✅ adminRoutes.js loaded successfully');
} catch (error) {
  console.log('❌ adminRoutes.js failed to load:', error.message);
}

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

// =================================================================
//                  TEST ROUTES - Always Work
// =================================================================
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working' 
  });
});

app.get('/api/debug', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Debug endpoint is working',
    routes: {
      auth: '/api/auth/*',
      users: '/api/users/*', 
      admin: '/api/admin/*'
    }
  });
});

// =================================================================
//                  SIMPLE AUTH ROUTES (Fallback)
// =================================================================
const simpleAuthRouter = express.Router();

simpleAuthRouter.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth register endpoint is working!',
    timestamp: new Date().toISOString()
  });
});

simpleAuthRouter.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth login endpoint is working!' 
  });
});

simpleAuthRouter.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth test endpoint is working!' 
  });
});

app.use('/api/auth', simpleAuthRouter);

// =================================================================
//                  MOUNT ACTUAL ROUTES IF THEY EXIST
// =================================================================
if (authRoutes && typeof authRoutes === 'function') {
  console.log('🚀 Mounting actual auth routes...');
  app.use('/api/auth', authRoutes);
}

if (userRoutes && typeof userRoutes === 'function') {
  console.log('🚀 Mounting actual user routes...');
  app.use('/api/users', userRoutes);
}

if (adminRoutes && typeof adminRoutes === 'function') {
  console.log('🚀 Mounting actual admin routes...');
  app.use('/api/admin', adminRoutes);
}

// =================================================================
//                  Error Handling
// =================================================================
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl,
    suggestion: 'Check /api/debug for available endpoints'
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
      console.log('📍 Available endpoints:');
      console.log('   - GET  /health');
      console.log('   - GET  /api/test');
      console.log('   - GET  /api/debug');
      console.log('   - POST /api/auth/register');
      console.log('   - POST /api/auth/login');
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
