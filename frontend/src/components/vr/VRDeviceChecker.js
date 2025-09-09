import React, { useState, useEffect } from 'react';

const VRDeviceChecker = () => {
  const [vrSupported, setVrSupported] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const checkVRSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setVrSupported(supported);
          
          if (supported) {
            const availableDevices = await navigator.xr.getDevices();
            setDevices(availableDevices);
          }
        } catch (error) {
          console.error('VR support check failed:', error);
          setVrSupported(false);
        }
      } else {
        setVrSupported(false);
      }
    };

    checkVRSupport();
  }, []);

  if (!vrSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          VR Not Supported
        </h3>
        <p className="text-red-700">
          Your device or browser does not support VR experiences. Please try using a VR-compatible device and browser.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium text-green-800 mb-2">
        VR Ready!
      </h3>
      <p className="text-green-700 mb-4">
        Your device supports VR experiences. {devices.length} VR device(s) detected.
      </p>
      <div className="text-sm text-green-600">
        {devices.map((device, index) => (
          <div key={index}>{device.deviceName || `VR Device ${index + 1`}</div>
        ))}
      </div>
    </div>
  );
};

export default VRDeviceChecker;
