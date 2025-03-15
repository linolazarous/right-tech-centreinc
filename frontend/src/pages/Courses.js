import React from 'react';
import CourseCard from '../components/CourseCard';

const Courses = () => {
    const courses = [
        { id: 1, title: 'React Mastery', description: 'Learn React from scratch', instructor: 'John Doe' },
        { id: 2, title: 'Node.js Basics', description: 'Introduction to Node.js', instructor: 'Jane Smith' },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default Courses;