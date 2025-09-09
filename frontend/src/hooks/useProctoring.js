import { useState, useEffect } from 'react';

export const useProctoring = (examId, settings) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState([]);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false
  });

  useEffect(() => {
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isMonitoring]);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: settings.webcamMonitoring,
        audio: settings.microphoneMonitoring
      });
      
      setPermissions({
        camera: settings.webcamMonitoring,
        microphone: settings.microphoneMonitoring,
        screen: false // Screen share requires additional permissions
      });

      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const startMonitoring = () => {
    // Start proctoring monitoring logic
    console.log('Starting proctoring monitoring...');
  };

  const stopMonitoring = () => {
    // Stop proctoring monitoring logic
    console.log('Stopping proctoring monitoring...');
  };

  const addViolation = (type, details) => {
    const violation = {
      id: Date.now(),
      type,
      details,
      timestamp: new Date().toISOString()
    };
    setViolations(prev => [...prev, violation]);
  };

  return {
    isMonitoring,
    violations,
    permissions,
    startMonitoring: () => setIsMonitoring(true),
    stopMonitoring: () => setIsMonitoring(false),
    requestPermissions,
    addViolation
  };
};
