import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {course.category}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {course.duration}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {course.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {course.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.floor(course.rating))}
            {'☆'.repeat(5 - Math.floor(course.rating))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            ({course.reviewCount})
          </span>
        </div>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">
          ${course.price}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${course.id}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Course
        </Link>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {course.enrolled} enrolled
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
