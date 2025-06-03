require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger'); // Assuming you have a logger utility

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/righttechcentre';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      poolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    });

    logger.info('✅ MongoDB connection established successfully');

    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
    });

    // Close the Mongoose connection when Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    logger.error(`❌ MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Advanced configuration for production
const configureDB = () => {
  if (process.env.NODE_ENV === 'production') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(`MongoDB: ${collectionName}.${method}`, {
        query,
        doc
      });
    });
  }

  mongoose.set('returnOriginal', false);
  mongoose.set('runValidators', true);
  mongoose.set('strictQuery', true);
};

module.exports = {
  connectDB,
  configureDB,
  mongoose,
  mongoURI: MONGO_URI
};
