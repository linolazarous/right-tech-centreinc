import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getReportedContent, moderateContent } from '../services/moderationService';
import { FaShieldAlt, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const Moderation = ({ moderatorId }) => {
  const [reportedItems, setReportedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const fetchReportedContent = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getReportedContent(moderatorId, activeTab);
        setReportedItems(data);
      } catch (err) {
        console.error('Moderation error:', err);
        setError('Failed to load reported content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedContent();
  }, [moderatorId, activeTab]);

  const handleModeration = async (itemId, action) => {
    try {
      await moderateContent(moderatorId, itemId, action);
      setReportedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Moderation action failed:', err);
      setError(`Failed to ${action} content`);
    }
  };

  return (
    <div className="moderation-dashboard">
      <h1 className="moderation-header">
        <FaShieldAlt /> Content Moderation
      </h1>

      <div className="moderation-tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Review
        </button>
        <button
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
        <button
          className={activeTab === 'rejected' ? 'active' : ''}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading content for moderation...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : reportedItems.length === 0 ? (
        <div className="no-content">
          No {activeTab} content to display
        </div>
      ) : (
        <div className="reported-items">
          {reportedItems.map(item => (
            <div key={item.id} className="reported-item">
              <div className="item-content">
                <h3>{item.type}: {item.title}</h3>
                <p>{item.content}</p>
                <div className="reported-by">
                  Reported by: {item.reportedBy} for {item.reason}
                </div>
              </div>

              {activeTab === 'pending' && (
                <div className="moderation-actions">
                  <button 
                    onClick={() => handleModeration(item.id, 'approve')}
                    className="approve-button"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button 
                    onClick={() => handleModeration(item.id, 'reject')}
                    className="reject-button"
                  >
                    <FaTimes /> Reject
                  </button>
                  <button 
                    onClick={() => handleModeration(item.id, 'delete')}
                    className="delete-button"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Moderation.propTypes = {
  moderatorId: PropTypes.string.isRequired
};

export default Moderation;
