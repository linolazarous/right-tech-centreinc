import React, { useState } from 'react';
  import { scheduleLiveQA } from '../services/liveQAService';

  const LiveQA = () => {
      const [sessionData, setSessionData] = useState({});

      const handleSchedule = async () => {
          const session = await scheduleLiveQA(sessionData);
          alert(`Session scheduled with ID: ${session.sessionId}`);
      };

      return (
          <div>
              <h1>Schedule Live Q&A</h1>
              <input
                  type="text"
                  placeholder="Topic"
                  onChange={(e) => setSessionData({ ...sessionData, topic: e.target.value })}
              />
              <input
                  type="datetime-local"
                  onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
              />
              <button onClick={handleSchedule}>Schedule</button>
          </div>
      );
  };

  export default LiveQA;