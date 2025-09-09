import React from 'react';

const PermissionModal = ({ onGrant, onDeny, permissions }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Permission Request</h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This exam requires the following permissions to ensure academic integrity:
        </p>

        <ul className="space-y-2 mb-6">
          {permissions.includes('camera') && (
            <li className="flex items-center">
              <span className="text-green-500 mr-2">📷</span>
              Camera access for video monitoring
            </li>
          )}
          {permissions.includes('microphone') && (
            <li className="flex items-center">
              <span className="text-green-500 mr-2">🎤</span>
              Microphone access for audio monitoring
            </li>
          )}
          {permissions.includes('screen') && (
            <li className="flex items-center">
              <span className="text-green-500 mr-2">🖥️</span>
              Screen sharing for activity monitoring
            </li>
          )}
        </ul>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your privacy is important to us. All data is encrypted and used solely for exam integrity purposes.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={onDeny}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Deny
          </button>
          <button
            onClick={onGrant}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Grant Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
