import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { awardBadge, getUserBadges } from '../services/gamificationService';

const Gamification = ({ userId }) => {
  const [availableBadges, setAvailableBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true);
        const [available, earned] = await Promise.all([
          fetch('/api/badges').then(res => res.json()),
          getUserBadges(userId)
        ]);
        setAvailableBadges(available);
        setUserBadges(earned);
      } catch (error) {
        console.error('Error loading badges:', error);
        setMessage({ text: 'Failed to load badges', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadBadges();
  }, [userId]);

  const handleAwardBadge = async () => {
    if (!selectedBadge) {
      setMessage({ text: 'Please select a badge', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const result = await awardBadge(userId, selectedBadge);
      setUserBadges(prev => [...prev, result.badge]);
      setMessage({ 
        text: `Earned badge: ${result.badge.name}`, 
        type: 'success' 
      });
      setSelectedBadge('');
    } catch (error) {
      console.error('Error awarding badge:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to award badge', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gamification-dashboard">
      <h1>Your Achievements</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
      
      <div className="badges-section">
        <h2>Your Badges</h2>
        {userBadges.length > 0 ? (
          <div className="badges-grid">
            {userBadges.map(badge => (
              <div key={badge.id} className="badge-item earned">
                <img src={badge.image} alt={badge.name} />
                <p>{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No badges earned yet</p>
        )}
      </div>
      
      <div className="award-section">
        <h2>Award New Badge</h2>
        <select
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
          disabled={isLoading || availableBadges.length === 0}
        >
          <option value="">Select a badge</option>
          {availableBadges
            .filter(badge => !userBadges.some(b => b.id === badge.id))
            .map(badge => (
              <option key={badge.id} value={badge.id}>
                {badge.name} - {badge.description}
              </option>
            ))}
        </select>
        <button 
          onClick={handleAwardBadge}
          disabled={isLoading || !selectedBadge}
        >
          {isLoading ? 'Processing...' : 'Award Badge'}
        </button>
      </div>
      
      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        {/* Leaderboard component would go here */}
      </div>
    </div>
  );
};

Gamification.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Gamification;
