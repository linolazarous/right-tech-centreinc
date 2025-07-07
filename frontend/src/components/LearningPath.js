import React, { useEffect, useState } from 'react';
import { getLearningPath } from '../services/learningPathService';
import PropTypes from 'prop-types';
import CourseProgressCard from './CourseProgressCard';
import { FaRoad, FaChartLine } from 'react-icons/fa';

const LearningPath = ({ userId }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        const fetchLearningPath = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getLearningPath(userId);
                setCourses(data);
            } catch (err) {
                setError('Failed to load learning path');
                console.error('Learning path error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLearningPath();
    }, [userId]);

    const currentCourses = courses.filter(course => !course.completed);
    const completedCourses = courses.filter(course => course.completed);

    if (isLoading) return <div className="learning-path-loading">Loading your learning path...</div>;
    if (error) return <div className="learning-path-error">{error}</div>;

    return (
        <div className="learning-path">
            <div className="learning-path-header">
                <h1><FaRoad /> Your Learning Journey</h1>
                <div className="progress-summary">
                    <FaChartLine />
                    <span>
                        {completedCourses.length} of {courses.length} courses completed
                        ({courses.length > 0 ? Math.round((completedCourses.length / courses.length) * 100) : 0}%)
                    </span>
                </div>
            </div>
            
            <div className="learning-path-tabs">
                <button
                    className={activeTab === 'current' ? 'active' : ''}
                    onClick={() => setActiveTab('current')}
                >
                    Current Courses
                </button>
                <button
                    className={activeTab === 'completed' ? 'active' : ''}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed Courses
                </button>
            </div>
            
            <div className="courses-container">
                {activeTab === 'current' ? (
                    currentCourses.length > 0 ? (
                        currentCourses.map((course) => (
                            <CourseProgressCard 
                                key={course._id} 
                                course={course}
                                userId={userId}
                            />
                        ))
                    ) : (
                        <div className="no-courses">
                            <p>You don't have any active courses in your learning path.</p>
                            <button className="explore-courses">Explore Recommended Courses</button>
                        </div>
                    )
                ) : (
                    completedCourses.length > 0 ? (
                        completedCourses.map((course) => (
                            <CourseProgressCard 
                                key={course._id} 
                                course={course}
                                userId={userId}
                                isCompleted
                            />
                        ))
                    ) : (
                        <div className="no-courses">
                            <p>You haven't completed any courses yet.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

LearningPath.propTypes = {
    userId: PropTypes.string.isRequired
};

export default LearningPath;
