import React from 'react';

const ProctoringControls = ({ onSettingsChange, settings }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Proctoring Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.screenRecording}
              onChange={(e) => onSettingsChange('screenRecording', e.target.checked)}
              className="rounded"
            />
            <span className="ml-2">Enable Screen Recording</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.webcamMonitoring}
              onChange={(e) => onSettingsChange('webcamMonitoring', e.target.checked)}
              className="rounded"
            />
            <span className="ml-2">Enable Webcam Monitoring</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.microphoneMonitoring}
              onChange={(e) => onSettingsChange('microphoneMonitoring', e.target.checked)}
              className="rounded"
            />
            <span className="ml-2">Enable Microphone Monitoring</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.browserLockdown}
              onChange={(e) => onSettingsChange('browserLockdown', e.target.checked)}
              className="rounded"
            />
            <span className="ml-2">Enable Browser Lockdown</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Violation Sensitivity</label>
          <select
            value={settings.sensitivity}
            onChange={(e) => onSettingsChange('sensitivity', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProctoringControls;
