import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rating from './Rating';

const CourseCard = ({ 
  course, 
  showProgress = false,
  className = '',
  showCredits = false
}) => {
  const progressPercentage = showProgress ? Math.min(100, Math.max(0, course.progress || 0)) : 0;

  const getBorderColor = () => {
    if (course.type) {
      switch (course.type) {
        case 'certification': return 'border-pink-400 hover:shadow-pink-400/20';
        case 'diploma': return 'border-teal-400 hover:shadow-teal-400/20';
        case 'degree': return 'border-purple-400 hover:shadow-purple-400/20';
        default: return 'border-gray-400 hover:shadow-gray-400/20';
      }
    }
    return 'border-gray-300 hover:shadow-lg';
  };

  const getLevelColor = () => {
    if (!course.level) return '';
    switch (course.level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-md border ${getBorderColor()} transition-all duration-300 hover:-translate-y-1 ${className}`}
      data-testid="course-card"
    >
      {course.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
              {course.title}
            </h2>
            {course.instructor && (
              <p className="text-sm text-gray-600 mb-2">
                By {course.instructor}
              </p>
            )}
          </div>
          {showCredits && course.credits && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {course.credits} Credits
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.rating !== undefined && (
            <Rating value={course.rating} />
          )}
          
          {course.duration && (
            <span className="inline-flex items-center text-xs text-gray-500">
              <i className="far fa-clock mr-1" aria-hidden="true"></i>
              {course.duration}
            </span>
          )}
          
          {course.level && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor()}`}>
              {course.level}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          {course.price !== undefined && (
            <div className="text-lg font-bold">
              {course.price === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>${course.price.toFixed(2)}</span>
              )}
            </div>
          )}
          
          <Link 
            to={`/courses/${course.id}`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showProgress && progressPercentage > 0 ? (
              <>
                <i className="fas fa-play mr-2" aria-hidden="true"></i>
                Continue
              </>
            ) : (
              <>
                <i className="fas fa-book-open mr-2" aria-hidden="true"></i>
                View Details
              </>
            )}
          </Link>
        </div>
        
        {showProgress && progressPercentage > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    instructor: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    duration: PropTypes.string,
    level: PropTypes.string,
    price: PropTypes.number,
    progress: PropTypes.number,
    credits: PropTypes.number,
    type: PropTypes.oneOf(['certification', 'diploma', 'degree'])
  }).isRequired,
  showProgress: PropTypes.bool,
  className: PropTypes.string,
  showCredits: PropTypes.bool
};

CourseCard.defaultProps = {
  showProgress: false,
  className: '',
  showCredits: false
};

export default CourseCard;
