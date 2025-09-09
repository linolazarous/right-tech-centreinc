import React, { useState, useEffect } from 'react';

const WebGLChecker = ({ children }) => {
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebGLAvailable(!!gl);
      } catch (e) {
        setWebGLAvailable(false);
      }
    };

    checkWebGL();
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">
          WebGL Not Supported
        </h3>
        <p className="text-yellow-700 mb-4">
          Your browser or device does not support WebGL, which is required for the virtual lab.
        </p>
        <div className="space-y-2 text-sm text-yellow-600">
          <p>• Try updating your browser</p>
          <p>• Enable WebGL in your browser settings</p>
          <p>• Try using a different browser (Chrome, Firefox, or Edge)</p>
        </div>
      </div>
    );
  }

  return children;
};

export default WebGLChecker;
