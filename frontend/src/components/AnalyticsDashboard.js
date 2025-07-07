import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getStudentProgress, getEngagementMetrics } from '../services/analyticsService';

const AnalyticsDashboard = ({ userId }) => {
    const [progress, setProgress] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [progressData, metricsData] = await Promise.all([
                getStudentProgress(userId),
                getEngagementMetrics(userId)
            ]);
            setProgress(progressData);
            setMetrics(metricsData);
            setError(null);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="analytics-loading">Loading analytics...</div>;
    if (error) return <div className="analytics-error">{error}</div>;

    return (
        <div className="analytics-dashboard">
            <h1>Analytics Dashboard</h1>
            <div className="progress-section">
                <h2>Course Progress</h2>
                {progress.map((course) => (
                    <div key={course.courseId} className="course-progress">
                        <p>{course.courseTitle}: {course.progress}%</p>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="metrics-section">
                <h2>Engagement Metrics</h2>
                <div className="metric-item">
                    <span>Time Spent:</span>
                    <span>{metrics.timeSpent} minutes</span>
                </div>
                <div className="metric-item">
                    <span>Quizzes Taken:</span>
                    <span>{metrics.quizzesTaken}</span>
                </div>
                <div className="metric-item">
                    <span>Courses Completed:</span>
                    <span>{metrics.coursesCompleted}</span>
                </div>
            </div>
        </div>
    );
};

AnalyticsDashboard.propTypes = {
    userId: PropTypes.string.isRequired
};

export default AnalyticsDashboard;
