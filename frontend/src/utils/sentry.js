import * as Sentry from '@sentry/react';

const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  
  if (dsn) {
    Sentry.init({
      dsn: dsn,
      environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
      release: process.env.REACT_APP_VERSION || '1.0.0',
      integrations: [
        new Sentry.BrowserTracing({
          // Tracing integration for performance monitoring
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/righttechcentre-iyysq\.ondigitalocean\.app/,
          ],
        }),
        new Sentry.Replay({
          // Session replay integration
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample rate for session replay
      replaysOnErrorSampleRate: 1.0, // Sample rate when errors occur
      
      // Before sending event to Sentry
      beforeSend(event) {
        // Filter out sensitive information
        if (event.request) {
          // Remove sensitive headers
          if (event.request.headers) {
            const sensitiveHeaders = ['authorization', 'cookie', 'token', 'api-key'];
            sensitiveHeaders.forEach(header => {
              if (event.request.headers[header]) {
                event.request.headers[header] = '[Filtered]';
              }
            });
          }
          
          // Filter URL parameters
          if (event.request.url) {
            const url = new URL(event.request.url);
            const sensitiveParams = ['password', 'token', 'secret', 'key'];
            sensitiveParams.forEach(param => {
              if (url.searchParams.has(param)) {
                url.searchParams.set(param, '[Filtered]');
              }
            });
            event.request.url = url.toString();
          }
        }
        
        return event;
      },
    });
    
    console.log('Sentry initialized successfully');
  } else {
    console.warn('Sentry DSN not found. Error tracking disabled.');
  }
};

// Export function to capture errors manually
export const captureException = (error, context = {}) => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

// Export function to capture messages
export const captureMessage = (message, level = 'info') => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
};

// Export function to set user context
export const setUserContext = (user) => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

// Export function to clear user context
export const clearUserContext = () => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.setUser(null);
  }
};

export default initSentry;
