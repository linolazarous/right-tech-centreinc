import React, { useState, useEffect } from 'react';
import { checkAPIHealth } from '../services/api';
import { Toaster, toast } from 'react-hot-toast';

const APITest = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await checkAPIHealth();
      setApiStatus(response);
      toast.success('API connection successful!');
    } catch (err) {
      setError(err.message);
      toast.error('API connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            API Connection Test
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Test the connection to your backend API
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={testAPI}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>

        {loading && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Testing connection to backend API...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800">Error:</h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}

        {apiStatus && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800">
              ✅ API Connection Successful!
            </h3>
            <div className="mt-4 bg-white rounded-lg p-4">
              <pre className="text-sm text-gray-800 overflow-auto">
                {JSON.stringify(apiStatus, null, 2)}
              </pre>
            </div>
            <p className="mt-4 text-sm text-green-600">
              Backend URL: {process.env.REACT_APP_API_BASE_URL}
            </p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800">API Information:</h3>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>Environment: {process.env.REACT_APP_ENVIRONMENT}</p>
            <p>API Base URL: {process.env.REACT_APP_API_BASE_URL}</p>
            <p>Current Time: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITest;
