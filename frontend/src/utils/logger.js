/**
 * Enhanced application logger with multiple log levels and production safeguards
 */

// Import from the same directory using relative paths
import { isProduction } from './constants';
import { logWarning, logError } from './monitoring';

const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

const shouldLog = (level) => {
  if (isProduction) {
    return level !== LogLevel.DEBUG;
  }
  return true;
};

const stringifyContext = (context) => {
  try {
    return JSON.stringify(context, null, 2);
  } catch (error) {
    return '[Non-serializable context]';
  }
};

export const logger = {
  debug: (message, context = {}) => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, stringifyContext(context));
    }
  },

  info: (message, context = {}) => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, stringifyContext(context));
    }
  },

  warn: (message, context = {}) => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, stringifyContext(context));
      logWarning(message, context);
    }
  },

  error: (error, context = {}) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;
    
    console.error(`[ERROR] ${new Date().toISOString()} - ${errorMessage}`, {
      ...context,
      stackTrace: stackTrace || 'No stack trace available'
    });

    logError(error, context);
  },

  logApiError: (error) => {
    const { config, response } = error;
    logger.error(error, {
      apiError: {
        url: config?.url,
        method: config?.method,
        params: config?.params,
        status: response?.status,
        data: response?.data
      }
    });
  }
};

// Freeze logger to prevent modifications
Object.freeze(logger);
