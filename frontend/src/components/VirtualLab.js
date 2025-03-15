import React, { useEffect, useState } from 'react';
  import { getVirtualLabs } from '../services/virtualLabService';

  const VirtualLab = () => {
      const [labs, setLabs] = useState([]);

      useEffect(() => {
          fetchLabs();
      }, []);

      const fetchLabs = async () => {
          const data = await getVirtualLabs();
          setLabs(data);
      };

      return (
          <div>
              <h1>Virtual Labs</h1>
              {labs.map((lab) => (
                  <div key={lab.id}>
                      <h2>{lab.title}</h2>
                      <p>{lab.description}</p>
                  </div>
              ))}
          </div>
      );
  };

  export default VirtualLab;