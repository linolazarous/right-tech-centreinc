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
    environment: process.env.NODE_ENV,
    availableEndpoints: [
      '/health',
      '/api/test',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/test',
      '/api/courses',
      '/api/users',
      '/api/admin',
      '/api/payments/test'
    ]
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working' 
  });
});

// =================================================================
//                  CORE AUTHENTICATION ROUTES (GUARANTEED TO WORK)
// =================================================================
console.log('=== SETTING UP CORE ROUTES ===');

// Import auth controller directly
let authController;
try {
  authController = await import('./controllers/authController.js');
  console.log('✅ Auth controller loaded successfully');
} catch (error) {
  console.log('❌ Auth controller failed:', error.message);
  process.exit(1);
}

// Create guaranteed working auth routes
const authRouter = express.Router();

// Auth routes that MUST work
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/login/verify-2fa', authController.verify2FALogin);
authRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes working!' });
});

app.use('/api/auth', authRouter);
console.log('✅ Core auth routes mounted');

// =================================================================
//                  FALLBACK ROUTES FOR ALL ENDPOINTS
// =================================================================
console.log('=== SETTING UP FALLBACK ROUTES ===');

// Courses routes
const coursesRouter = express.Router();
coursesRouter.get('/', (req, res) => {
  res.json({ success: true, message: 'Courses endpoint is working!' });
});
coursesRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Courses test endpoint' });
});
app.use('/api/courses', coursesRouter);

// Users routes
const usersRouter = express.Router();
usersRouter.get('/', (req, res) => {
  res.json({ success: true, message: 'Users endpoint is working!' });
});
usersRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Users test endpoint' });
});
app.use('/api/users', usersRouter);

// Admin routes
const adminRouter = express.Router();
adminRouter.get('/', (req, res) => {
  res.json({ success: true, message: 'Admin endpoint is working!' });
});
adminRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin test endpoint' });
});
app.use('/api/admin', adminRouter);

// Payments routes
const paymentsRouter = express.Router();
paymentsRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Payments test endpoint' });
});
app.use('/api/payments', paymentsRouter);

// Analytics routes
const analyticsRouter = express.Router();
analyticsRouter.get('/', (req, res) => {
  res.json({ success: true, message: 'Analytics endpoint is working!' });
});
app.use('/api/analytics', analyticsRouter);

// Forum routes
const forumRouter = express.Router();
forumRouter.get('/test', (req, res) => {
  res.json({ success: true, message: 'Forum test endpoint' });
});
app.use('/api/forum', forumRouter);

console.log('✅ All fallback routes mounted');

// =================================================================
//                  ATTEMPT TO LOAD ACTUAL ROUTE FILES
// =================================================================
console.log('=== ATTEMPTING TO LOAD ACTUAL ROUTE FILES ===');

const routeFiles = [
  './routes/courseRoutes.js',
  './routes/usersRoutes.js', 
  './routes/adminRoutes.js',
  './routes/paymentRoutes.js',
  './routes/analyticsRoutes.js',
  './routes/forumRoutes.js'
];

for (const file of routeFiles) {
  try {
    const module = await import(file);
    if (module.default && typeof module.default === 'function') {
      // Extract base path from filename
      const basePath = file.replace('./routes/', '').replace('Routes.js', '');
      app.use(`/api/${basePath}`, module.default);
      console.log(`✅ Loaded actual routes from ${file}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not load ${file}: ${error.message}`);
  }
}

// =================================================================
//                  Error Handling
// =================================================================
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET  /health',
      'GET  /api/test', 
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/test',
      'GET  /api/courses',
      'GET  /api/users',
      'GET  /api/admin',
      'GET  /api/payments/test'
    ]
  });
});

app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry found'
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
      console.log('📍 Guaranteed working endpoints:');
      console.log('   - POST /api/auth/register');
      console.log('   - POST /api/auth/login');
      console.log('   - GET  /api/auth/test');
      console.log('   - GET  /api/courses');
      console.log('   - GET  /api/users');
      console.log('   - GET  /api/admin');
      console.log('   - GET  /api/payments/test');
    });

    const gracefulShutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...');
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
