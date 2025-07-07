import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSocialFeed, getSuggestedConnections } from '../services/socialService';
import SocialPost from './SocialPost';
import ConnectionCard from './ConnectionCard';
import { FaUsers, FaComment, FaUserPlus, FaBell } from 'react-icons/fa';

const Social = ({ userId }) => {
  const [feed, setFeed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [socialFeed, suggestedConnections] = await Promise.all([
          getSocialFeed(userId),
          getSuggestedConnections(userId)
        ]);
        setFeed(socialFeed);
        setSuggestions(suggestedConnections);
      } catch (err) {
        console.error('Social error:', err);
        setError('Failed to load social data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialData();
  }, [userId]);

  if (isLoading) return <div className="loading">Loading social features...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="social-container">
      <div className="social-header">
        <h1>
          <FaUsers /> Social Hub
        </h1>
        <p className="subheader">
          Connect with peers, share insights, and grow together
        </p>
      </div>

      <div className="social-tabs">
        <button
          className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <FaComment /> Community Feed
        </button>
        <button
          className={`tab-button ${activeTab === 'connect' ? 'active' : ''}`}
          onClick={() => setActiveTab('connect')}
        >
          <FaUserPlus /> Connect
        </button>
        <button
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> Notifications
        </button>
      </div>

      <div className="social-content">
        {activeTab === 'feed' && (
          <div className="social-feed">
            {feed.length === 0 ? (
              <div className="empty-feed">
                <p>Your feed is empty. Start following people or join groups to see activity.</p>
                <button onClick={() => setActiveTab('connect')}>
                  Find People to Connect With
                </button>
              </div>
            ) : (
              feed.map(post => (
                <SocialPost
                  key={post.id}
                  post={post}
                  userId={userId}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="connection-suggestions">
            <h2>Suggested Connections</h2>
            {suggestions.length === 0 ? (
              <div className="no-suggestions">
                No connection suggestions available at this time
              </div>
            ) : (
              <div className="suggestions-grid">
                {suggestions.map(user => (
                  <ConnectionCard
                    key={user.id}
                    user={user}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications">
            <h2>Your Notifications</h2>
            <div className="notification-list">
              <div className="notification-item">
                <div className="notification-content">
                  <p>You have no new notifications</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="social-footer">
        <p>
          Need help with social features? Visit our <a href="/help/social">Social Hub Guide</a>
        </p>
      </div>
    </div>
  );
};

Social.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Social;
