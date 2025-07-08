import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { logger } from '../utils/logger';
import { isProduction } from '../utils/constants';

const errorMessages = {
  404: {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
  },
  403: {
    title: 'Access Denied',
    description: "You don't have permission to access this page.",
  },
  500: {
    title: 'Server Error',
    description: 'Something went wrong on our end. Please try again later.',
  },
  default: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
};

const CustomErrorPage = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const statusCode = error?.status || error?.response?.status || 500;
  const { title, description } = errorMessages[statusCode] || errorMessages.default;

  if (isProduction) {
    logger.error('ErrorPage rendered', {
      error: error?.message,
      statusCode,
      path: window.location.pathname,
    });
  }

  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-5xl font-bold text-red-600 mb-4">{statusCode}</h1>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRefresh} variant="primary">
            Refresh Page
          </Button>
          <Button onClick={handleGoHome} variant="secondary">
            Go to Homepage
          </Button>
        </div>

        {!isProduction && error && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-mono text-sm font-bold mb-2">Error Details (Development Only)</h3>
            <pre className="text-xs text-red-600 overflow-auto">
              {error.stack || error.message || JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

CustomErrorPage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string,
    status: PropTypes.number,
    response: PropTypes.shape({
      status: PropTypes.number,
    }),
  }),
  resetErrorBoundary: PropTypes.func,
};

export default CustomErrorPage;
