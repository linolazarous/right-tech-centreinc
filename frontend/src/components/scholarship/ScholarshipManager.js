import React, { useState, useEffect } from 'react';
import { CardSkeleton } from '../ui/LoadingSkeleton';
import ErrorAlert from '../ui/ErrorAlert';

const ScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch('/api/scholarships');
      const data = await response.json();
      setScholarships(data);
    } catch (err) {
      setError('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CardSkeleton />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Scholarships</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Apply for Scholarship
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{scholarship.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{scholarship.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">${scholarship.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Deadline:</span>
                <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  scholarship.status === 'open' ? 'bg-green-100 text-green-800' :
                  scholarship.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {scholarship.status}
                </span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400">
              {scholarship.status === 'open' ? 'Apply Now' : 'Closed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipManager;
