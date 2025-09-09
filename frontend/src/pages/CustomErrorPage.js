import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import PageLayout from '../layouts/PageLayout';

const CustomErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const errorMessages = {
    404: {
      title: 'Page Not Found',
      message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    },
    500: {
      title: 'Server Error',
      message: 'Something went wrong on our servers. Please try again later.',
    },
    403: {
      title: 'Access Denied',
      message: 'You do not have permission to access this page.',
    },
    default: {
      title: 'Oops! Something went wrong',
      message: 'An unexpected error has occurred. Please try again.',
    }
  };

  const status = error?.status || 500;
  const errorInfo = errorMessages[status] || errorMessages.default;

  return (
    <PageLayout
      seoTitle={`${errorInfo.title} | Right Tech Centre`}
      seoDescription="An error occurred while loading the page."
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20">
            <FaExclamationTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Content */}
          <div className="mt-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {status} - {errorInfo.title}
            </h1>
            
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {errorInfo.message}
            </p>

            {error?.message && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Error details: {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaHome className="mr-2 h-4 w-4" />
                Go Home
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaRedo className="mr-2 h-4 w-4" />
                Try Again
              </button>
            </div>

            {/* Support Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact our support team at{' '}
                <a
                  href="mailto:support@righttechcentre.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@righttechcentre.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CustomErrorPage;
