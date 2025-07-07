import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AccessibilitySettings = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from localStorage if available
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        // Apply dark mode class to document body
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        // Save preference to localStorage
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <div className="accessibility-settings">
            <h1>Accessibility Settings</h1>
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="toggle-input"
                />
                <span className="toggle-slider"></span>
                Dark Mode
            </label>
        </div>
    );
};

export default AccessibilitySettings;
