import React, { useEffect, useState } from 'react';
import { getStudentProgress, getEngagementMetrics } from '../services/analyticsService';

const AnalyticsDashboard = ({ userId }) => {
    const [progress, setProgress] = useState([]);
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        const progressData = await getStudentProgress(userId);
        const metricsData = await getEngagementMetrics(userId);
        setProgress(progressData);
        setMetrics(metricsData);
    };

    return (
        <div>
            <h1>Analytics Dashboard</h1>
            <div>
                <h2>Course Progress</h2>
                {progress.map((course) => (
                    <div key={course.courseId}>
                        <p>{course.courseTitle}: {course.progress}%</p>
                    </div>
                ))}
            </div>
            <div>
                <h2>Engagement Metrics</h2>
                <p>Time Spent: {metrics.timeSpent} minutes</p>
                <p>Quizzes Taken: {metrics.quizzesTaken}</p>
                <p>Courses Completed: {metrics.coursesCompleted}</p>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;