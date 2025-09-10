import React from 'react';
import * as Sentry from '@sentry/react';
import ErrorBoundary from './ErrorBoundary';

const SentryErrorBoundary = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <ErrorBoundary 
          error={error} 
          componentStack={componentStack}
          onReset={resetError}
        />
      )}
      onError={(error, componentStack, eventId) => {
        Sentry.captureException(error, { contexts: { react: { componentStack } } });
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default SentryErrorBoundary;
