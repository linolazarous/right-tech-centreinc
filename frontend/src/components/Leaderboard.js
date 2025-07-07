import React from 'react';
import PropTypes from 'prop-types';
import { FaTrophy, FaMedal, FaUser } from 'react-icons/fa';

const Leaderboard = ({ leaderboard, isLoading, error, className }) => {
  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <FaTrophy className="gold" />;
      case 1: return <FaMedal className="silver" />;
      case 2: return <FaMedal className="bronze" />;
      default: return <span className="rank">{index + 1}</span>;
    }
  };

  if (isLoading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
  if (error) return <div className="leaderboard-error">Failed to load leaderboard</div>;
  if (leaderboard.length === 0) return <div className="leaderboard-empty">No leaderboard data available</div>;

  return (
    <div className={`leaderboard ${className}`}>
      <h2 className="leaderboard-title">
        <FaTrophy /> Top Performers
      </h2>
      
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={entry.userId || index} className="leaderboard-item">
            <div className="user-rank">
              {getRankIcon(index)}
            </div>
            
            <div className="user-info">
              <div className="user-avatar">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} />
                ) : (
                  <FaUser className="default-avatar" />
                )}
              </div>
              <span className="user-name">{entry.name}</span>
            </div>
            
            <div className="user-score">
              <span className="score-value">{entry.score}</span>
              <span className="score-label">points</span>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="leaderboard-footer">
        <button className="view-all">View Full Leaderboard</button>
      </div>
    </div>
  );
};

Leaderboard.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      avatar: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

Leaderboard.defaultProps = {
  isLoading: false,
  error: null,
  className: ''
};

export default Leaderboard;
