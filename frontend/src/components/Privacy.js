import React, { useState } from 'react';

const Privacy = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  const handleSave = () => {
    // Handle save logic here
    console.log('Show Email:', showEmail, 'Show Profile:', showProfile);
  };

  return (
    <div className="privacy">
      <h1>Privacy Settings</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showEmail}
            onChange={(e) => setShowEmail(e.target.checked)}
          />
          Show Email
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showProfile}
            onChange={(e) => setShowProfile(e.target.checked)}
          />
          Show Profile
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Privacy;