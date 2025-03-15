import React, { useEffect, useState } from 'react';
import { getLearningPath } from '../services/learningPathService';

const LearningPath = ({ userId }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchLearningPath();
    }, [userId]);

    const fetchLearningPath = async () => {
        const data = await getLearningPath(userId);
        setCourses(data);
    };

    return (
        <div>
            <h1>Learning Path</h1>
            {courses.map((course) => (
                <div key={course._id}>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                </div>
            ))}
        </div>
    );
};

export default LearningPath;