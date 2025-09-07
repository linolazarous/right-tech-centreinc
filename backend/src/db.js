// =================================================================
//                      Imports & Configuration
// =================================================================
import 'dotenv/config';
import mongoose from 'mongoose';
import logger from './utils/logger.js'; // Note: .js extension required in ES modules

// Enhanced MongoDB URI configuration for DigitalOcean
const MONGO_URI = process.env.MONGO_URI || 
  process.env.DATABASE_URL || // DigitalOcean automatically provides this
  'mongodb://localhost:27017/righttechcentre';

// Connection options optimized for DigitalOcean
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased from 5s for cloud environments
  socketTimeoutMS: 60000, // Increased from 45s
  maxPoolSize: 15, // Increased from 10 for DO's infrastructure
  minPoolSize: 3, // Maintain minimum connections
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  compressors: ['zlib'], // Enable compression
  zlibCompressionLevel: 7,
  connectTimeoutMS: 10000,
  family: 4,
  heartbeatFrequencyMS: 10000,
  appName: 'righttechcentre'
};

// Production-optimized configuration
const configureDB = () => {
  // Debugging in development
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(`MongoDB: ${collectionName}.${method}`, {
        query: JSON.stringify(query),
        doc: JSON.stringify(doc),
        executionTime: new Date()
      });
    });
  }

  // Schema options
  mongoose.set('returnOriginal', false);
  mongoose.set('runValidators', true);
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false); // Disable command buffering
  mongoose.set('autoIndex', process.env.NODE_ENV !== 'production'); // Auto-index in dev only
  
  // Connection events for monitoring
  mongoose.connection.on('fullsetup', () => logger.info('MongoDB replica set connected'));
  mongoose.connection.on('all', () => logger.info('MongoDB all servers connected'));
  mongoose.connection.on('reconnect', () => logger.warn('MongoDB reconnected'));
};

const connectDB = async () => {
  try {
    // Configure before connecting
    configureDB();

    const conn = await mongoose.connect(MONGO_URI, mongoOptions);

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    // Enhanced connection event handling
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB cluster');
      logger.debug(`MongoDB cluster time: ${new Date(mongoose.connection.now())}`);
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`, {
        stack: err.stack,
        errorCode: err.code
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB', {
        lastActive: mongoose.connection.lastActive,
        idleSince: mongoose.connection.idleSince
      });
    });

    // Close connection gracefully
    const gracefulShutdown = async (signal) => {
      logger.warn(`Received ${signal}, closing MongoDB connection`);
      try {
        await mongoose.connection.close(false);
        logger.info('Mongoose connection closed gracefully');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`, {
      error: {
        name: err.name,
        code: err.code,
        stack: err.stack
      },
      connectionAttempt: {
        uri: MONGO_URI,
        options: mongoOptions
      }
    });

    // Implement retry logic for production
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Health check function
const checkDBHealth = async () => {
  try {
    const result = await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      dbStats: await mongoose.connection.db.stats(),
      ping: result,
      connections: mongoose.connection.readyState,
      lastQuery: mongoose.connection.lastQuery,
      poolSize: mongoose.connection.poolSize
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      stack: err.stack
    };
  }
};

// Export as ES Module
export {
  connectDB,
  configureDB,
  checkDBHealth,
  mongoose,
  MONGO_URI as mongoURI,
  mongoOptions as connectionOptions
};

// Default export for convenience
export default {
  connectDB,
  configureDB,
  checkDBHealth,
  mongoose,
  mongoURI: MONGO_URI,
  connectionOptions: mongoOptions
};


