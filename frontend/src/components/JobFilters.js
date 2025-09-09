import React, { useState } from 'react';

const JobFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    experience: '',
    salary: '',
    remote: false
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Filter Jobs</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            placeholder="City or remote"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Experience Level</label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Any Experience</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Minimum Salary</label>
          <select
            value={filters.salary}
            onChange={(e) => handleFilterChange('salary', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Any Salary</option>
            <option value="30000">$30,000+</option>
            <option value="50000">$50,000+</option>
            <option value="75000">$75,000+</option>
            <option value="100000">$100,000+</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remote"
            checked={filters.remote}
            onChange={(e) => handleFilterChange('remote', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="remote" className="ml-2 text-sm">
            Remote Jobs Only
          </label>
        </div>

        <button
          onClick={() => setFilters({
            location: '',
            type: '',
            experience: '',
            salary: '',
            remote: false
          })}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
