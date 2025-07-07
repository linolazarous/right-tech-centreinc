import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadVRContent } from '../services/vrService';

const ARVRIntegration = ({ userId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vrInitialized, setVrInitialized] = useState(false);

    useEffect(() => {
        const initializeVR = async () => {
            try {
                await loadVRContent(userId);
                setVrInitialized(true);
                setError(null);
            } catch (err) {
                setError('Failed to load VR content');
                console.error('VR initialization error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeVR();
        
        return () => {
            // Cleanup VR resources
        };
    }, [userId]);

    if (isLoading) return <div className="vr-loading">Initializing VR environment...</div>;
    if (error) return <div className="vr-error">{error}</div>;

    return (
        <div className="vr-container">
            <h1>Immersive Learning Experience</h1>
            <p>Explore interactive educational content in VR</p>
            
            <div id="vr-viewport" className="vr-viewport">
                {vrInitialized && (
                    <button 
                        className="enter-vr-button"
                        onClick={() => document.getElementById('vr-viewport').requestFullscreen()}
                    >
                        Enter VR Mode
                    </button>
                )}
            </div>
            
            <div className="vr-controls">
                <button className="vr-control">Rotate View</button>
                <button className="vr-control">Zoom</button>
                <button className="vr-control">Reset Position</button>
            </div>
        </div>
    );
};

ARVRIntegration.propTypes = {
    userId: PropTypes.string.isRequired
};

export default ARVRIntegration;
