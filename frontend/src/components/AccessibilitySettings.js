import React, { useState } from 'react';

const AccessibilitySettings = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div>
            <h1>Accessibility Settings</h1>
            <label>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
                Dark Mode
            </label>
        </div>
    );
};

export default AccessibilitySettings;