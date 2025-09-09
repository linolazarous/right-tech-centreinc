import React, { useState, useEffect } from 'react';

const ProctoringMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    if (isMonitoring) {
      // Simulate proctoring monitoring
      const interval = setInterval(() => {
        // Check for violations periodically
        if (Math.random() < 0.1) { // 10% chance of violation
          setViolations(prev => prev + 1);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Proctoring Monitor</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Monitoring Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Violations Detected:</span>
          <span className="text-red-600 font-semibold">{violations}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsMonitoring(true)}
            disabled={isMonitoring}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Start Monitoring
          </button>
          <button
            onClick={() => setIsMonitoring(false)}
            disabled={!isMonitoring}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            Stop Monitoring
          </button>
        </div>

        {isMonitoring && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ Monitoring active. Please remain in frame and avoid prohibited activities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProctoringMonitor;
