require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs');
const https = require('https');
const cluster = require('cluster');
const os = require('os');
const path = require('path');

// Initialize Express app
const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// ======================
// Standard Middleware
// ======================
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Enhanced logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ======================
// Database Connections
// ======================

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// PostgreSQL Connection Pool (better than single client)
const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err);
});

// Test PostgreSQL connection
pgPool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

// ======================
// Route Handlers
// ======================

// MongoDB Example Route
app.get('/api/mongo/users', async (req, res, next) => {
  try {
    const User = require('./models/UserModel');
    const users = await User.find().lean();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// PostgreSQL Example Route
app.get('/api/pg/users', async (req, res, next) => {
  try {
    const { rows } = await pgPool.query('SELECT * FROM users');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// Health Check Endpoint
// ======================
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB
    await mongoose.connection.db.admin().ping();
    
    // Check PostgreSQL
    await pgPool.query('SELECT 1');
    
    res.status(200).json({
      status: 'UP',
      databases: {
        mongodb: 'CONNECTED',
        postgresql: 'CONNECTED'
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ======================
// Static Files
// ======================
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.gz')) {
      res.set('Content-Encoding', 'gzip');
    }
  }
}));

// ======================
// Error Handling
// ======================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && !err.isOperational 
    ? 'Something went wrong!'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 5500;
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

let server;

const startServer = () => {
  if (SSL_ENABLED && process.env.NODE_ENV === 'production') {
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : null
    };
    server = https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`🚀 HTTPS Server running on port ${PORT}`);
    });
  } else {
    server = app.listen(PORT, () => {
      console.log(`🚀 HTTP Server running on port ${PORT}`);
    });
  }
};

// Cluster mode (Production only)
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  console.log(`👑 Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}

// ======================
// Graceful Shutdown
// ======================
const shutdown = async () => {
  console.log('🛑 Received shutdown signal. Closing servers...');
  
  // Close HTTP/HTTPS server
  if (server) {
    server.close(() => {
      console.log('⛔ HTTP server closed');
    });
  }
  
  // Close MongoDB connection
  await mongoose.connection.close(false)
    .then(() => console.log('⛔ MongoDB connection closed'))
    .catch(err => console.error('MongoDB close error:', err));
  
  // Close PostgreSQL pool
  await pgPool.end()
    .then(() => console.log('⛔ PostgreSQL pool closed'))
    .catch(err => console.error('PostgreSQL close error:', err));
  
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  shutdown();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});

module.exports = { app, pgPool };
