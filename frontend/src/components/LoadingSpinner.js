import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 border-solid border-current border-r-transparent
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className="flex items-center justify-center">
      <div 
        className={spinnerClasses.trim()} 
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Alternative version with more customization options
const LoadingSpinnerAdvanced = ({ 
  size = 'medium', 
  color = 'text-indigo-600', 
  thickness = 'border-2',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${thickness} ${color} animate-spin rounded-full border-r-transparent`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Container component for full-page loading
export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <LoadingSpinner size="large" />
  </div>
);

// Inline loader for buttons or small spaces
export const InlineLoader = () => (
  <LoadingSpinner size="small" className="inline-block" />
);

export default LoadingSpinner;
