import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSubscriptions, cancelSubscription, upgradeSubscription } from '../services/subscriptionService';
import { FaCreditCard, FaSyncAlt, FaTimesCircle } from 'react-icons/fa';

const Subscription = ({ userId }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getSubscriptions(userId);
        setSubscriptions(data);
      } catch (err) {
        console.error('Subscription error:', err);
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      setIsLoading(true);
      await cancelSubscription(userId, subscriptionId);
      const updated = await getSubscriptions(userId);
      setSubscriptions(updated);
    } catch (err) {
      console.error('Cancel error:', err);
      setError('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (subscriptionId, newPlan) => {
    try {
      setIsLoading(true);
      await upgradeSubscription(userId, subscriptionId, newPlan);
      const updated = await getSubscriptions(userId);
      setSubscriptions(updated);
    } catch (err) {
      console.error('Upgrade error:', err);
      setError('Failed to upgrade subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const pastSubscriptions = subscriptions.filter(sub => sub.status !== 'active');

  if (isLoading) return <div className="loading">Loading subscription data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="subscription-container">
      <h1 className="subscription-header">
        <FaCreditCard /> Subscription Management
      </h1>

      <div className="subscription-tabs">
        <button
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Subscriptions
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Subscription History
        </button>
      </div>

      {activeTab === 'current' ? (
        currentSubscriptions.length > 0 ? (
          <div className="subscription-list">
            {currentSubscriptions.map(sub => (
              <div key={sub.id} className="subscription-card">
                <div className="subscription-info">
                  <h3>{sub.planName}</h3>
                  <p className="price">${sub.price}/month</p>
                  <p className="renewal">
                    Next billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                  </p>
                  <div className="features">
                    <h4>Features:</h4>
                    <ul>
                      {sub.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="subscription-actions">
                  <button
                    onClick={() => handleUpgrade(sub.id, 'premium')}
                    className="upgrade-button"
                    disabled={sub.planName === 'Premium'}
                  >
                    <FaSyncAlt /> Upgrade Plan
                  </button>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    className="cancel-button"
                  >
                    <FaTimesCircle /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-subscriptions">
            <p>You don't have any active subscriptions</p>
            <button className="browse-plans">Browse Subscription Plans</button>
          </div>
        )
      ) : (
        pastSubscriptions.length > 0 ? (
          <div className="subscription-history">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Period</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {pastSubscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.planName}</td>
                    <td className={`status ${sub.status}`}>{sub.status}</td>
                    <td>
                      {new Date(sub.startDate).toLocaleDateString()} -{' '}
                      {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Present'}
                    </td>
                    <td>${sub.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-history">
            No past subscription history available
          </div>
        )
      )}
    </div>
  );
};

Subscription.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Subscription;
