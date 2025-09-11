/**
 * Application monitoring and error tracking integration
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing'; // Correct import
import { isProduction, SENTRY_DSN } from './constants';
import { logger } from './logger'; // Use named import

// Initialize monitoring tools
export const initMonitoring = () => {
  if (isProduction && SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            tracingOrigins: ['localhost', /\.righttechcentre\.com$/],
          }),
        ],
        tracesSampleRate: parseFloat(process.env.REACT_APP_SENTRY_TRACE_RATE) || 0.2,
        environment: process.env.REACT_APP_ENV || 'production',
        release: process.env.REACT_APP_VERSION || 'unknown',
        beforeSend(event) {
          // Filter out sensitive information
          if (event.request) {
            event.request.headers = {};
          }
          return event;
        }
      });
      
      logger.info('Monitoring initialized');
    } catch (error) {
      logger.error('Failed to initialize monitoring', error);
    }
  }
};

// Error tracking
export const logError = (error, context = {}) => {
  if (!isProduction || !SENTRY_DSN) return;

  try {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
      }
      
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(String(error));
      }
    });
  } catch (monitoringError) {
    logger.error('Failed to log error to monitoring', monitoringError);
  }
};

// Warning tracking
export const logWarning = (message, context = {}) => {
  if (!isProduction || !SENTRY_DSN) return;

  try {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
      }
      Sentry.captureMessage(message, 'warning'); // Updated severity level
    });
  } catch (error) {
    logger.error('Failed to log warning to monitoring', error);
  }
};

// Performance metrics
export const trackPerformance = (metric) => {
  if (!isProduction) return;
  
  logger.info(`Performance Metric: ${metric.name}`, {
    value: metric.value,
    rating: metric.rating
  });
  
  // Add additional monitoring integration here if needed
};

// User activity tracking
export const trackUserActivity = (eventName, properties = {}) => {
  if (!isProduction) return;
  
  logger.info(`User Activity: ${eventName}`, properties);
  
  // Example integration with analytics services:
  // if (window.analytics) {
  //   window.analytics.track(eventName, properties);
  // }
};
