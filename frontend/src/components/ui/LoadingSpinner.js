import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 border-solid border-current border-r-transparent
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${className}
  `.trim();

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className={spinnerClasses}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Additional spinner variants
export const PageLoader = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-50">
    <LoadingSpinner size="large" />
  </div>
);

export const ButtonSpinner = ({ color = 'white' }) => (
  <LoadingSpinner size="small" color={color} />
);

export const InlineSpinner = () => (
  <div className="inline-flex items-center">
    <LoadingSpinner size="small" />
    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading...</span>
  </div>
);

export const TextSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <LoadingSpinner size="medium" />
    {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
  </div>
);

// Skeleton loader component
export const SkeletonLoader = ({ 
  type = 'card', 
  count = 1,
  className = '' 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className} ${
        type === 'card' ? 'h-32' :
        type === 'text' ? 'h-4' :
        type === 'circle' ? 'rounded-full h-12 w-12' :
        'h-24'
      }`}
    />
  ));

  return <>{skeletons}</>;
};

export default LoadingSpinner;
