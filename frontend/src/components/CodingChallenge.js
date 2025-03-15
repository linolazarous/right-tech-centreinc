import React, { useEffect, useState } from 'react';
  import { getCodingChallenges } from '../services/codingChallengeService';

  const CodingChallenge = () => {
      const [challenges, setChallenges] = useState([]);

      useEffect(() => {
          fetchChallenges();
      }, []);

      const fetchChallenges = async () => {
          const data = await getCodingChallenges();
          setChallenges(data);
      };

      return (
          <div>
              <h1>Coding Challenges</h1>
              {challenges.map((challenge) => (
                  <div key={challenge.id}>
                      <h2>{challenge.title}</h2>
                      <p>{challenge.description}</p>
                  </div>
              ))}
          </div>
      );
  };

  export default CodingChallenge;