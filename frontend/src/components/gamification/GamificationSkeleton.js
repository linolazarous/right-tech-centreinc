import React from 'react';

const GamificationSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamificationSkeleton;
