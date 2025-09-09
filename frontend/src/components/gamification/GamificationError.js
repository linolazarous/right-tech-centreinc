import React from 'react';

const GamificationError = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div className="text-red-500 text-4xl mb-4">🎮</div>
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
        Gamification Error
      </h3>
      <p className="text-red-700 dark:text-red-300 mb-4">
        {error || 'Failed to load gamification data'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default GamificationError;
