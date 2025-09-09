import React from 'react';

const LabLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-white text-lg">Loading virtual lab environment...</p>
        <p className="text-gray-400 text-sm">This may take a few moments</p>
      </div>
    </div>
  );
};

export default LabLoading;
