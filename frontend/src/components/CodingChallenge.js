import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCodingChallenges } from '../services/codingChallengeService';

const CodingChallenge = ({ userId }) => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const challengesPerPage = 5;

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                const data = await getCodingChallenges(userId);
                setChallenges(data);
                setError(null);
            } catch (err) {
                setError('Failed to load coding challenges');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [userId]);

    const filteredChallenges = difficultyFilter === 'all' 
        ? challenges 
        : challenges.filter(c => c.difficulty === difficultyFilter);

    const indexOfLastChallenge = currentPage * challengesPerPage;
    const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
    const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
    const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);

    if (loading) return <div className="loading">Loading challenges...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="coding-challenges">
            <h1>Coding Challenges</h1>
            
            <div className="challenge-controls">
                <div className="filter-section">
                    <label>Filter by Difficulty:</label>
                    <select 
                        value={difficultyFilter}
                        onChange={(e) => {
                            setDifficultyFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>
            
            <div className="challenge-list">
                {currentChallenges.length > 0 ? (
                    currentChallenges.map((challenge) => (
                        <div key={challenge.id} className="challenge-card">
                            <div className="challenge-header">
                                <h2>{challenge.title}</h2>
                                <span className={`difficulty ${challenge.difficulty}`}>
                                    {challenge.difficulty}
                                </span>
                            </div>
                            <p className="description">{challenge.description}</p>
                            <div className="challenge-footer">
                                <span>{challenge.languages.join(', ')}</span>
                                <button 
                                    className="solve-button"
                                    onClick={() => openChallenge(challenge.id)}
                                >
                                    Solve Challenge
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No challenges match your filters</p>
                )}
            </div>
            
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

CodingChallenge.propTypes = {
    userId: PropTypes.string.isRequired
};

export default CodingChallenge;
