import React, { useState } from 'react';
  import { integrateGoogleWorkspace } from '../services/integrationService';

  const Integration = () => {
      const [userId, setUserId] = useState('');

      const handleIntegrate = async () => {
          const result = await integrateGoogleWorkspace(userId);
          alert(result.message);
      };

      return (
          <div>
              <h1>Integration</h1>
              <input
                  type="text"
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
              />
              <button onClick={handleIntegrate}>Integrate Google Workspace</button>
          </div>
      );
  };

  export default Integration;