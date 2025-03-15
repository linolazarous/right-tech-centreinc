import React, { useState } from 'react';
  import { awardBadge } from '../services/gamificationService';

  const Gamification = () => {
      const [badge, setBadge] = useState('');

      const handleAward = async () => {
          const userId = localStorage.getItem('userId');
          const result = await awardBadge(userId, badge);
          alert(`Badge awarded: ${result.badge}`);
      };

      return (
          <div>
              <h1>Gamification</h1>
              <input
                  type="text"
                  placeholder="Enter Badge Name"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
              />
              <button onClick={handleAward}>Award Badge</button>
          </div>
      );
  };

  export default Gamification;