import React from 'react';
import ProctoringMonitor from '../components/ProctoringMonitor';

const ProctoringPage = () => {
    const examData = { /* Mock exam data */ };
    return (
        <div>
            <ProctoringMonitor examData={examData} />
        </div>
    );
};

export default ProctoringPage;