import React from 'react';
import { Link } from 'react-router-dom';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-white border-opacity-20">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900">
            <svg 
              className="h-8 w-8 text-indigo-600 dark:text-indigo-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          
          {/* Content */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Scheduled Maintenance
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Right Tech Centre is currently undergoing scheduled maintenance to improve your experience. 
              We'll be back online shortly.
            </p>
            
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <svg 
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Estimated completion: 2 hours
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>For urgent inquiries, please contact:</p>
                <a 
                  href="mailto:support@righttechcentre.com" 
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@righttechcentre.com
                </a>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Refresh Page
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-white text-opacity-70">
            &copy; {new Date().getFullYear()} Right Tech Centre. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
