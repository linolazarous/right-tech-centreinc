import React, { useState } from 'react';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    education: [],
    experience: [],
    skills: []
  });

  const [currentSection, setCurrentSection] = useState('personal');

  const sections = {
    personal: 'Personal Information',
    education: 'Education',
    experience: 'Work Experience',
    skills: 'Skills'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Resume Builder</h2>
      
      <div className="flex space-x-2 mb-6">
        {Object.entries(sections).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCurrentSection(key)}
            className={`px-4 py-2 rounded ${
              currentSection === key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {currentSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        )}

        {currentSection === 'education' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Education</h3>
            {/* Education form fields */}
          </div>
        )}

        {currentSection === 'experience' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
            {/* Experience form fields */}
          </div>
        )}

        {currentSection === 'skills' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            {/* Skills form fields */}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Previous
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            {currentSection === 'skills' ? 'Complete Resume' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
