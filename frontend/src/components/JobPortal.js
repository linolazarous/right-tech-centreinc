import React, { useEffect, useState } from 'react';
import { getJobRecommendations, searchJobs } from '../services/jobPortalService';
import PropTypes from 'prop-types';
import JobCard from './JobCard';

const JobPortal = ({ userId }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError('');
                let data;
                
                if (searchQuery.trim()) {
                    data = await searchJobs(userId, searchQuery);
                } else {
                    data = await getJobRecommendations(userId);
                }
                
                setJobs(data);
            } catch (err) {
                setError('Failed to load jobs');
                console.error('Job portal error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [userId, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    return (
        <div className="job-portal-container">
            <div className="job-portal-header">
                <h1>Job Opportunities</h1>
                <p>Find your next career opportunity</p>
                
                <form onSubmit={handleSearch} className="job-search">
                    <input
                        type="text"
                        placeholder="Search by job title, company, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            
            {loading ? (
                <div className="loading-jobs">Loading job recommendations...</div>
            ) : error ? (
                <div className="job-error">{error}</div>
            ) : currentJobs.length === 0 ? (
                <div className="no-jobs">
                    {searchQuery.trim() ? 
                        'No jobs match your search. Try different keywords.' : 
                        'No job recommendations available at this time.'}
                </div>
            ) : (
                <>
                    <div className="job-results-count">
                        Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs
                    </div>
                    
                    <div className="jobs-list">
                        {currentJobs.map(job => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                userId={userId}
                            />
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="job-pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <span>Page {currentPage} of {totalPages}</span>
                            
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

JobPortal.propTypes = {
    userId: PropTypes.string.isRequired
};

export default JobPortal;
