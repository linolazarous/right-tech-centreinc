import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRecommendations } from '../services/recommendationService';
import RecommendationCard from './RecommendationCard';
import { FaLightbulb, FaBook, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const Recommendation = ({ userId }) => {
  const [recommendations, setRecommendations] = useState({
    courses: [],
    resources: [],
    mentors: [],
    studyGroups: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getRecommendations(userId);
        setRecommendations(data);
      } catch (err) {
        console.error('Recommendation error:', err);
        setError('Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  const getTabIcon = (tab) => {
    switch(tab) {
      case 'courses': return <FaBook />;
      case 'resources': return <FaLightbulb />;
      case 'mentors': return <FaChalkboardTeacher />;
      case 'studyGroups': return <FaUsers />;
      default: return <FaLightbulb />;
    }
  };

  if (isLoading) return <div className="loading">Loading personalized recommendations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recommendation-container">
      <h1 className="recommendation-header">
        <FaLightbulb /> Personalized Recommendations
      </h1>
      <p className="recommendation-subheader">
        Based on your learning history and preferences
      </p>

      <div className="recommendation-tabs">
        {['courses', 'resources', 'mentors', 'studyGroups'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
            {recommendations[tab]?.length > 0 && (
              <span className="count-badge">{recommendations[tab].length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="recommendation-content">
        {recommendations[activeTab]?.length > 0 ? (
          <div className="recommendation-grid">
            {recommendations[activeTab].map((item, index) => (
              <RecommendationCard
                key={item.id || index}
                type={activeTab}
                data={item}
              />
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            No {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()} recommendations at this time
          </div>
        )}
      </div>

      <div className="recommendation-footer">
        <button className="refresh-button">
          Refresh Recommendations
        </button>
        <p className="feedback-prompt">
          Help us improve your recommendations by providing feedback
        </p>
      </div>
    </div>
  );
};

Recommendation.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Recommendation;
