import React, { useEffect, useState } from 'react';
import { monitorExam } from '../services/proctoringService';

const ProctoringMonitor = ({ examData }) => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchProctoringResult();
    }, [examData]);

    const fetchProctoringResult = async () => {
        const data = await monitorExam(examData);
        setResult(data);
    };

    return (
        <div>
            <h1>Proctoring Monitor</h1>
            {result && (
                <div>
                    <p>Face Detected: {result.faceDetected ? 'Yes' : 'No'}</p>
                    <p>Suspicious Activity: {result.suspiciousActivity ? 'Yes' : 'No'}</p>
                    <p>Behavior Analysis: {result.behaviorAnalysis}</p>
                </div>
            )}
        </div>
    );
};

export default ProctoringMonitor;