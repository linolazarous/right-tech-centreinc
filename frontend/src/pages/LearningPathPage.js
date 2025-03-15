import React from 'react';
import LearningPath from '../components/LearningPath';

const LearningPathPage = () => {
    const userId = localStorage.getItem('userId'); // Replace with actual user ID
    return (
        <div>
            <LearningPath userId={userId} />
        </div>
    );
};

export default LearningPathPage;