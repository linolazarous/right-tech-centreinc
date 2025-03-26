import React from 'react';
import CourseCard from '../components/CourseCard';
import AdBanner from "../components/AdBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = ({ userId }) => {
    const courses = [
        { id: 1, title: 'React Mastery', description: 'Learn React from scratch', instructor: 'John Doe' },
        { id: 2, title: 'Node.js Basics', description: 'Introduction to Node.js', instructor: 'Jane Smith' },
    ];

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Welcome to Right Tech Centre</h1>
                <AdBanner userId={userId} />
                <h2 className="text-2xl font-bold mb-4">Featured Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Home;
