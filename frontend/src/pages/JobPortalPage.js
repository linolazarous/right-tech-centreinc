import React, { useEffect, useState } from 'react';
import { getJobRecommendations } from '../services/jobPortalService';

const JobPage = () => {
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Job Portal</h1>
            <div>
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-bold">{job.title}</h2>
                        <p className="text-gray-600">{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobPage;