import React from 'react';

const LearningPath = ({ path }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Learning Path: {path.title}</h3>
      
      <div className="space-y-3">
        {path.modules.map((module, index) => (
          <div
            key={module.id}
            className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium">{module.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{module.duration}</span>
                <span>{module.lessons} lessons</span>
                <span className={`px-2 py-1 rounded ${
                  module.status === 'completed' ? 'bg-green-100 text-green-800' :
                  module.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {module.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded p-3">
        <div className="flex justify-between items-center text-sm">
          <span>Overall Progress</span>
          <span>{path.progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${path.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
