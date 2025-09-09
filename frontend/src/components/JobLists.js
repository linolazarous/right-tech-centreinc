import React from 'react';

const JobLists = ({ jobs }) => {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {job.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Location:</span>
              <span className="ml-2">{job.location}</span>
            </div>
            <div>
              <span className="text-gray-500">Salary:</span>
              <span className="ml-2">{job.salary}</span>
            </div>
            <div>
              <span className="text-gray-500">Experience:</span>
              <span className="ml-2">{job.experience}</span>
            </div>
            <div>
              <span className="text-gray-500">Posted:</span>
              <span className="ml-2">{job.postedDate}</span>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {job.description}
          </p>

          <div className="flex justify-between items-center">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Apply Now
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              Save Job
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobLists;
