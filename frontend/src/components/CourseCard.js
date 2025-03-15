import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">Instructor: {course.instructor}</p>
            <Link to={`/courses/${course.id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Enroll Now
            </Link>
        </div>
    );
};

export default CourseCard;