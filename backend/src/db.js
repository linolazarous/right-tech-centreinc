// =================================================================
//                      Imports & Configuration
// =================================================================
import 'dotenv/config';
import mongoose from 'mongoose';
import logger from './utils/logger.js'; // Note: .js extension required in ES modules

// Use the exact connection string from DigitalOcean App Platform
const MONGO_URI = process.env.MONGO_URI || 
  process.env.DATABASE_URL || 
  'mongodb://localhost:27017/righttechcentre';

// Connection options optimized for DigitalOcean MongoDB
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased for cloud environments
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  ssl: true, // Essential for TLS connections
  sslValidate: true, // Validate SSL certificate
  tlsAllowInvalidCertificates: false, // Important for security
  connectTimeoutMS: 10000,
  bufferCommands: false, // Disable command buffering
  autoIndex: process.env.NODE_ENV !== 'production' // Auto-index in dev only
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
  mongoose.set('bufferCommands', false);
  
  // Connection events for monitoring
  mongoose.connection.on('fullsetup', () => logger.info('MongoDB replica set connected'));
  mongoose.connection.on('all', () => logger.info('MongoDB all servers connected'));
  mongoose.connection.on('reconnect', () => logger.warn('MongoDB reconnected'));
};

const connectDB = async () => {
  try {
    // Configure before connecting
    configureDB();

    logger.info('Attempting to connect to MongoDB...', {
      uri: MONGO_URI.replace(/:[^:]*@/, ':****@'), // Hide password in logs
      options: { ...mongoOptions }
    });

    const conn = await mongoose.connect(MONGO_URI, mongoOptions);

    logger.info(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    logger.debug(`Database name: ${conn.connection.name}`);
    logger.debug(`MongoDB version: ${conn.connection.version}`);

    // Enhanced connection event handling
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB cluster');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`, {
        stack: err.stack,
        errorCode: err.code
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
    });

    mongoose.connection.on('close', () => {
      logger.info('Mongoose connection closed');
    });

    // Close connection gracefully
    const gracefulShutdown = async (signal) => {
      logger.warn(`Received ${signal}, closing MongoDB connection gracefully`);
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

    return conn;

  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`, {
      error: {
        name: err.name,
        code: err.code,
        stack: err.stack
      },
      connectionAttempt: {
        uri: MONGO_URI.replace(/:[^:]*@/, ':****@'), // Hide password in logs
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
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'disconnected',
        readyState: mongoose.connection.readyState,
        message: 'Database not connected'
      };
    }

    const result = await mongoose.connection.db.admin().ping();
    const dbStats = await mongoose.connection.db.stats();
    
    return {
      status: 'healthy',
      dbStats: {
        db: dbStats.db,
        collections: dbStats.collections,
        objects: dbStats.objects,
        storageSize: dbStats.storageSize,
        indexSize: dbStats.indexSize
      },
      ping: result,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      poolSize: mongoose.connection.poolSize
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    };
  }
};

// Utility function to get connection info (for debugging)
const getConnectionInfo = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    models: Object.keys(mongoose.connection.models),
    config: {
      useNewUrlParser: mongoOptions.useNewUrlParser,
      useUnifiedTopology: mongoOptions.useUnifiedTopology,
      ssl: mongoOptions.ssl,
      sslValidate: mongoOptions.sslValidate
    }
  };
};

// Export as ES Module
export {
  connectDB,
  configureDB,
  checkDBHealth,
  getConnectionInfo,
  mongoose,
  MONGO_URI as mongoURI,
  mongoOptions as connectionOptions
};

// Default export for convenience
export default {
  connectDB,
  configureDB,
  checkDBHealth,
  getConnectionInfo,
  mongoose,
  mongoURI: MONGO_URI,
  connectionOptions: mongoOptions
};
