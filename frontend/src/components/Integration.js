import React, { useState } from 'react';
import { integrateGoogleWorkspace, checkIntegrationStatus } from '../services/integrationService';
import PropTypes from 'prop-types';
import { FaGoogle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Integration = ({ userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isIntegrated, setIsIntegrated] = useState(false);
    const [error, setError] = useState('');
    const [showAuthWindow, setShowAuthWindow] = useState(false);

    const checkStatus = async () => {
        try {
            const status = await checkIntegrationStatus(userId);
            setIsIntegrated(status.connected);
        } catch (err) {
            console.error('Error checking integration status:', err);
        }
    };

    const handleIntegration = async () => {
        setIsLoading(true);
        setError('');
        try {
            // In a real app, this would open OAuth popup
            const result = await integrateGoogleWorkspace(userId);
            if (result.success) {
                setIsIntegrated(true);
                setShowAuthWindow(false);
            } else {
                setError(result.message || 'Integration failed');
            }
        } catch (err) {
            setError('Failed to complete integration');
            console.error('Integration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="integration-container">
            <h1 className="text-2xl font-bold mb-6">Third-Party Integrations</h1>
            
            <div className="integration-card">
                <div className="integration-header">
                    <FaGoogle className="text-blue-500 text-2xl" />
                    <h2 className="text-xl font-semibold">Google Workspace</h2>
                    {isIntegrated ? (
                        <span className="integration-status connected">
                            <FaCheckCircle className="text-green-500" /> Connected
                        </span>
                    ) : (
                        <span className="integration-status disconnected">
                            Not Connected
                        </span>
                    )}
                </div>
                
                <p className="integration-description">
                    Connect your Google account to sync calendar, drive, and email.
                </p>
                
                {error && (
                    <div className="integration-error">
                        <FaExclamationTriangle /> {error}
                    </div>
                )}
                
                <button
                    onClick={isIntegrated ? checkStatus : handleIntegration}
                    disabled={isLoading}
                    className={`integration-button ${isIntegrated ? 'connected' : ''}`}
                >
                    {isLoading ? 'Processing...' : 
                     isIntegrated ? 'Reconnect' : 'Connect Google Workspace'}
                </button>
                
                {showAuthWindow && (
                    <div className="auth-window-overlay">
                        <div className="auth-window">
                            <h3>Authorize Google Workspace</h3>
                            <p>Please complete the authorization in the popup window</p>
                            <button onClick={() => setShowAuthWindow(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="integration-help">
                <h3>Need help with integrations?</h3>
                <p>Contact our support team at integrations@righttechcentre.com</p>
            </div>
        </div>
    );
};

Integration.propTypes = {
    userId: PropTypes.string.isRequired
};

export default Integration;
