import React, { useEffect, useState } from 'react';
  import { recommendCareerPath } from '../services/careerPathService';

  const CareerPathRecommendation = ({ userId }) => {
      const [careerPaths, setCareerPaths] = useState([]);

      useEffect(() => {
          fetchCareerPaths();
      }, [userId]);

      const fetchCareerPaths = async () => {
          const data = await recommendCareerPath(userId);
          setCareerPaths(data);
      };

      return (
          <div>
              <h1>Career Path Recommendations</h1>
              {careerPaths.map((path) => (
                  <div key={path.title}>
                      <h2>{path.title}</h2>
                      <p>{path.description}</p>
                  </div>
              ))}
          </div>
      );
  };

  export default CareerPathRecommendation;