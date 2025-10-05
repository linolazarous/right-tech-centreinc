// =================================================================
//                      Database Connection (Mongoose)
// =================================================================
import 'dotenv/config';
import mongoose from 'mongoose';
import { logger } from './utils/logger.js';

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/righttechcentre';

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  ssl: process.env.NODE_ENV === 'production',
  tlsAllowInvalidCertificates: false,
  connectTimeoutMS: 10000,
  bufferCommands: false,
  autoIndex: process.env.NODE_ENV !== 'production',
};

export const configureDB = () => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(`MongoDB: ${collectionName}.${method}`, { query, doc });
    });
  }

  mongoose.set('returnOriginal', false);
  mongoose.set('runValidators', true);
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) =>
    logger.error(`MongoDB connection error: ${err.message}`)
  );
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
};

export const connectDB = async () => {
  try {
    configureDB();
    logger.info('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI, mongoOptions);
    logger.info(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

export const checkDBHealth = async () => {
  try {
    if (mongoose.connection.readyState !== 1)
      return { status: 'disconnected', readyState: mongoose.connection.readyState };

    const ping = await mongoose.connection.db.admin().ping();
    const stats = await mongoose.connection.db.stats();

    return {
      status: 'healthy',
      ping,
      db: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      storageSize: stats.storageSize,
    };
  } catch (err) {
    return { status: 'unhealthy', error: err.message };
  }
};

export const getConnectionInfo = () => ({
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host,
  port: mongoose.connection.port,
  name: mongoose.connection.name,
});

export default {
  connectDB,
  configureDB,
  checkDBHealth,
  getConnectionInfo,
};
