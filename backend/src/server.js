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
app.set('trust proxy', 1); // Trust first proxy

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
      '/api/auth/*',
      '/api/users/*',
      '/api/courses/*',
      '/api/admin/*',
      '/api/payment/*',
      '/api/analytics/*'
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
//                  DYNAMIC ROUTE LOADING SYSTEM
// =================================================================
console.log('=== LOADING ALL ROUTES ===');

// Route configuration map
const routeConfig = [
  { path: '/api/auth', file: './routes/authRoutes.js', name: 'Authentication' },
  { path: '/api/users', file: './routes/usersRoutes.js', name: 'Users' },
  { path: '/api/admin', file: './routes/adminRoutes.js', name: 'Admin' },
  { path: '/api/courses', file: './routes/courseRoutes.js', name: 'Courses' },
  { path: '/api/payments', file: './routes/paymentRoutes.js', name: 'Payments' },
  { path: '/api/analytics', file: './routes/analyticsRoutes.js', name: 'Analytics' },
  { path: '/api/forum', file: './routes/forumRoutes.js', name: 'Forum' },
  { path: '/api/certificates', file: './routes/certificateRoutes.js', name: 'Certificates' },
  { path: '/api/jobs', file: './routes/jobRoutes.js', name: 'Jobs' },
  { path: '/api/career', file: './routes/careerPathRoutes.js', name: 'Career Path' },
  { path: '/api/assessments', file: './routes/skillsAssessmentRoutes.js', name: 'Assessments' },
  { path: '/api/vr', file: './routes/vrLearningRoutes.js', name: 'VR Learning' },
  { path: '/api/gamification', file: './routes/gamificationRoutes.js', name: 'Gamification' },
  { path: '/api/subscriptions', file: './routes/subscriptionRoutes.js', name: 'Subscriptions' },
  { path: '/api/notifications', file: './routes/pushNotificationRoutes.js', name: 'Notifications' }
];

// Load and mount all routes
const loadRoutes = async () => {
  for (const route of routeConfig) {
    try {
      const routeModule = await import(route.file);
      if (routeModule.default) {
        app.use(route.path, routeModule.default);
        console.log(`✅ ${route.name} routes mounted at ${route.path}`);
      } else {
        console.log(`⚠️  ${route.name} routes file exists but no default export`);
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log(`❌ ${route.name} routes file not found: ${route.file}`);
      } else {
        console.log(`❌ Error loading ${route.name} routes:`, error.message);
      }
    }
  }
};

// Load core routes that should always work
const loadCoreRoutes = async () => {
  console.log('=== LOADING CORE ROUTES ===');
  
  // Auth routes (core functionality)
  try {
    const authController = await import('./controllers/authController.js');
    const authRouter = express.Router();
    
    // Public routes
    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);
    authRouter.post('/login/verify-2fa', authController.verify2FALogin);
    authRouter.get('/test', (req, res) => {
      res.json({ success: true, message: 'Auth system working!' });
    });
    
    app.use('/api/auth', authRouter);
    console.log('✅ Core auth routes mounted at /api/auth');
  } catch (error) {
    console.log('❌ Critical: Failed to load auth controller:', error.message);
  }
  
  // Load all other routes
  await loadRoutes();
};

// =================================================================
//                  Error Handling
// =================================================================
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl,
    suggestion: 'Check the / endpoint for available API routes'
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
    await loadCoreRoutes();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log('📍 All routes loaded successfully!');
      console.log('📍 Available API endpoints:');
      routeConfig.forEach(route => {
        console.log(`   - ${route.path}/*`);
      });
    });

    const gracefulShutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
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
