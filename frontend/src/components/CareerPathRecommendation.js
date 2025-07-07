import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { recommendCareerPath } from '../services/careerPathService';
import CareerPathCard from './CareerPathCard';

const CareerPathRecommendation = ({ userId }) => {
    const [careerPaths, setCareerPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCareerPaths = async () => {
            try {
                setLoading(true);
                const data = await recommendCareerPath(userId);
                setCareerPaths(data);
                setError(null);
            } catch (err) {
                setError('Failed to load career recommendations');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCareerPaths();
    }, [userId]);

    if (loading) return <div className="loading">Loading recommendations...</div>;
    if (error) return <div className="error">{error}</div>;
    if (careerPaths.length === 0) return <div>No career paths found based on your profile.</div>;

    return (
        <div className="career-recommendations">
            <h1>Career Path Recommendations</h1>
            <div className="career-grid">
                {careerPaths.map((path) => (
                    <CareerPathCard key={path.id} path={path} />
                ))}
            </div>
        </div>
    );
};

CareerPathRecommendation.propTypes = {
    userId: PropTypes.string.isRequired
};

export default CareerPathRecommendation;
