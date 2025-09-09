import React from 'react';

const EnrolledCourses = ({ courses }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex items-center space-x-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-12 h-12 rounded"
              />
              <div>
                <h4 className="font-medium">{course.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {course.instructor}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Progress: {course.progress}%
              </div>
              <div className="w-20 bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-gray-500 text-center py-8">No courses enrolled yet</p>
      )}
    </div>
  );
};

export default EnrolledCourses;
