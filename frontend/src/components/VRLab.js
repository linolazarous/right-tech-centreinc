import React, { useEffect, useState } from 'react';
  import { getVRLabs } from '../services/vrLabService';

  const VRLab = () => {
      const [labs, setLabs] = useState([]);

      useEffect(() => {
          fetchLabs();
      }, []);

      const fetchLabs = async () => {
          const data = await getVRLabs();
          setLabs(data);
      };

      return (
          <div>
              <h1>VR Labs</h1>
              {labs.map((lab) => (
                  <div key={lab.id}>
                      <h2>{lab.title}</h2>
                      <p>{lab.description}</p>
                  </div>
              ))}
          </div>
      );
  };

  export default VRLab;