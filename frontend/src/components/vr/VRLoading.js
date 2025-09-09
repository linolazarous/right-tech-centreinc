import React from 'react';

const VRLoading = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="w-64 h-2 bg-gray-700 rounded-full mb-4 mx-auto">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-lg mb-2">Loading VR Experience</p>
        <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
        <p className="text-xs text-gray-500 mt-4">
          Please put on your VR headset when ready
        </p>
      </div>
    </div>
  );
};

export default VRLoading;
