import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCareerAdvice } from '../services/careerCoachingService';

const CareerCoaching = ({ userId }) => {
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('advice');

    useEffect(() => {
        const fetchAdvice = async () => {
            try {
                setLoading(true);
                const data = await getCareerAdvice(userId);
                setAdvice(data);
                setError(null);
            } catch (err) {
                setError('Failed to load career advice');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvice();
    }, [userId]);

    const retryFetch = () => {
        setError(null);
        setLoading(true);
        fetchAdvice();
    };

    if (loading) return <div className="loading">Analyzing your career profile...</div>;
    if (error) return (
        <div className="error">
            {error}
            <button onClick={retryFetch}>Try Again</button>
        </div>
    );

    return (
        <div className="career-coaching">
            <h1>Personalized Career Coaching</h1>
            
            <div className="coaching-tabs">
                <button 
                    className={activeTab === 'advice' ? 'active' : ''}
                    onClick={() => setActiveTab('advice')}
                >
                    Career Advice
                </button>
                <button 
                    className={activeTab === 'courses' ? 'active' : ''}
                    onClick={() => setActiveTab('courses')}
                >
                    Recommended Courses
                </button>
            </div>
            
            {activeTab === 'advice' && (
                <div className="advice-section">
                    <h2>Your Career Assessment</h2>
                    <p className="advice-content">{advice.advice}</p>
                    <div className="strengths">
                        <h3>Your Strengths:</h3>
                        <ul>
                            {advice.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
            {activeTab === 'courses' && (
                <div className="courses-section">
                    <h2>Recommended Learning Path</h2>
                    <div className="course-grid">
                        {advice.recommendedCourses.map((course) => (
                            <div key={course.id} className="course-card">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <span className="skill-match">{course.matchScore}% match</span>
                                <button className="enroll-button">Enroll</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

CareerCoaching.propTypes = {
    userId: PropTypes.string.isRequired
};

export default CareerCoaching;
