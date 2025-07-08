import React from 'react';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import { logger } from '../utils/logger';
import { MAINTENANCE_ESTIMATE } from '../utils/constants';

const MaintenancePage = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  logger.warn('Maintenance page accessed', {
    time: new Date().toISOString(),
    path: window.location.pathname,
  });

  return (
    <>
      <Helmet>
        <title>Maintenance Mode | Right Tech Centre</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
          <h2 className="text-xl font-semibold mb-6">
            We're improving your learning experience
          </h2>
          
          <p className="text-lg mb-6">
            Right Tech Centre is currently undergoing scheduled maintenance. 
            We'll be back soon with an improved platform to serve you better.
          </p>
          
          {MAINTENANCE_ESTIMATE && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Estimated completion: {MAINTENANCE_ESTIMATE}
            </p>
          )}
          
          <div className="mt-8">
            <p className="text-sm">
              Need immediate assistance? Email us at{' '}
              <a 
                href="mailto:support@righttechcentre.com" 
                className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                support@righttechcentre.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaintenancePage;
