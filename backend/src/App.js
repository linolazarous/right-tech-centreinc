require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

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

// Rate limiting (more generous on DO)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increased from 100
  message: 'Too many requests from this IP'
});
app.use(limiter);

// ======================
// Standard Middleware
// ======================
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ======================
// PostgreSQL Connection (DigitalOcean Managed Database)
// ======================
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || // DO provides this automatically
  `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pgPool.on('error', (err) => {
  console.error('PostgreSQL Pool Error:', err);
});

// Test connection
pgPool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

// ======================
// Route Handlers
// ======================

// PostgreSQL Example Route
app.get('/api/users', async (req, res, next) => {
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

// Health Check (Simplified for DO)
app.get('/health', async (req, res) => {
  try {
    await pgPool.query('SELECT 1');
    res.status(200).json({
      status: 'UP',
      database: 'CONNECTED',
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

// Static Files
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y'
}));

// ======================
// Error Handling
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 8080; // DO uses 8080 by default
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await pgPool.end();
  process.exit(0);
});

module.exports = app;
