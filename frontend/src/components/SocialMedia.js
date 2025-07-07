import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSocialMediaIntegrations, connectSocialAccount } from '../services/socialMediaService';
import { FaTwitter, FaLinkedin, FaFacebook, FaCheckCircle } from 'react-icons/fa';

const SocialMedia = ({ userId }) => {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getSocialMediaIntegrations(userId);
        setIntegrations(data);
      } catch (err) {
        console.error('Social media error:', err);
        setError('Failed to load social media integrations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, [userId]);

  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      await connectSocialAccount(userId, platform);
      // Refresh the list after connecting
      const data = await getSocialMediaIntegrations(userId);
      setIntegrations(data);
    } catch (err) {
      console.error('Connection error:', err);
      setError(`Failed to connect ${platform} account`);
    } finally {
      setConnecting(null);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <FaTwitter />;
      case 'linkedin': return <FaLinkedin />;
      case 'facebook': return <FaFacebook />;
      default: return null;
    }
  };

  if (isLoading) return <div className="loading">Loading social media integrations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="social-media-container">
      <h1 className="social-media-header">Social Media Integration</h1>
      <p className="subheader">
        Connect your social media accounts to share achievements and connect with others
      </p>

      <div className="integration-grid">
        {integrations.map(integration => (
          <div key={integration.platform} className="integration-card">
            <div className="platform-icon">
              {getPlatformIcon(integration.platform)}
              <span className="platform-name">{integration.platform}</span>
            </div>

            {integration.connected ? (
              <div className="connection-status connected">
                <FaCheckCircle /> Connected
                <p className="connection-details">
                  Connected as: {integration.username}
                </p>
              </div>
            ) : (
              <button
                onClick={() => handleConnect(integration.platform)}
                disabled={connecting === integration.platform}
                className="connect-button"
              >
                {connecting === integration.platform ? 'Connecting...' : 'Connect Account'}
              </button>
            )}

            <div className="integration-benefits">
              <h4>Benefits:</h4>
              <ul>
                {integration.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="privacy-note">
        <p>
          We only request minimal permissions and never post without your approval.
          <a href="/privacy/social-media">Learn more</a> about how we handle your data.
        </p>
      </div>
    </div>
  );
};

SocialMedia.propTypes = {
  userId: PropTypes.string.isRequired
};

export default SocialMedia;
