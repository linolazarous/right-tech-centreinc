import React, { useEffect, useState } from 'react';
import { getJobRecommendations } from '../services/jobPortalService';

const JobPortal = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const userId = localStorage.getItem('userId');
        const data = await getJobRecommendations(userId);
        setJobs(data);
    };

    return (
        <div>
            <h1>Job Portal</h1>
            <div>
                {jobs.map((job) => (
                    <div key={job._id}>
                        <h2>{job.title}</h2>
                        <p>{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobPortal;