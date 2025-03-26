require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Client } = require('pg');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

// Database Connections
// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// PostgreSQL Connection
const pgClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const connectPostgreSQL = async () => {
  try {
    await pgClient.connect();
    logger.info('Connected to PostgreSQL');
  } catch (err) {
    logger.error('PostgreSQL connection error:', err);
    process.exit(1);
  }
};

// Initialize database connections
(async () => {
  await connectMongoDB();
  await connectPostgreSQL();
})();

// Routes
app.get('/mongo-users', async (req, res) => {
  try {
    const User = require('./models/UserModel');
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    logger.error('MongoDB query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/pg-users', async (req, res) => {
  try {
    const result = await pgClient.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    logger.error('PostgreSQL query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    postgres: pgClient._connected ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Server startup
const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await mongoose.disconnect();
    await pgClient.end();
    logger.info('Server closed');
    process.exit(0);
  });
});
