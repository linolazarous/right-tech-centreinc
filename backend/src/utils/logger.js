const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf, errors, json, colorize } = format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (stack) {
    msg += `\n${stack}`;
  }
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Custom format for file output
const fileFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports: [
    // Error logs (only errors)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Combined logs (all levels)
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // DigitalOcean App Platform system logs
    process.env.NODE_ENV === 'production' && new winston.transports.Console({
      format: combine(
        timestamp(),
        json()
      )
    })
  ].filter(Boolean), // Filter out false values
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// Pretty print for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
    handleExceptions: true,
    handleRejections: true
  }));
}

// Stream for morgan (HTTP logging)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Handle uncaught exceptions (outside express)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Don't exit in production - let DigitalOcean restart if needed
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = logger;
