import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import JobMatchCard from './JobMatchCard';

const JobMatching = ({ userId }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        experienceLevel: '',
        remoteOnly: false
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError('');
                const params = {
                    userId,
                    ...filters
                };
                const response = await axios.get('/api/jobs', { params });
                setJobs(response.data);
            } catch (err) {
                setError('Failed to load job matches');
                console.error('Job matching error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [userId, filters]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="job-matching-container">
            <div className="job-matching-header">
                <h2>Your Personalized Job Matches</h2>
                <p>Based on your profile and preferences</p>
            </div>
            
            <div className="job-filters">
                <div className="filter-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="City or country"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                </div>
                
                <div className="filter-group">
                    <label htmlFor="experienceLevel">Experience Level:</label>
                    <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={filters.experienceLevel}
                        onChange={handleFilterChange}
                    >
                        <option value="">Any</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
                
                <div className="filter-group checkbox">
                    <input
                        type="checkbox"
                        id="remoteOnly"
                        name="remoteOnly"
                        checked={filters.remoteOnly}
                        onChange={handleFilterChange}
                    />
                    <label htmlFor="remoteOnly">Remote Only</label>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-jobs">Loading your job matches...</div>
            ) : error ? (
                <div className="job-error">{error}</div>
            ) : jobs.length === 0 ? (
                <div className="no-jobs">
                    No matching jobs found. Try adjusting your filters.
                </div>
            ) : (
                <div className="job-matches-grid">
                    {jobs.map(job => (
                        <JobMatchCard 
                            key={job.id} 
                            job={job} 
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

JobMatching.propTypes = {
    userId: PropTypes.string.isRequired
};

export default JobMatching;
