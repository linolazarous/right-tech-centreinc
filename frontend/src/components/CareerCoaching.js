import React, { useEffect, useState } from 'react';
  import { getCareerAdvice } from '../services/careerCoachingService';

  const CareerCoaching = ({ userId }) => {
      const [advice, setAdvice] = useState(null);

      useEffect(() => {
          fetchAdvice();
      }, [userId]);

      const fetchAdvice = async () => {
          const data = await getCareerAdvice(userId);
          setAdvice(data);
      };

      return (
          <div>
              <h1>Career Coaching</h1>
              {advice && (
                  <div>
                      <p>{advice.advice}</p>
                      <p>Recommended Courses: {advice.recommendedCourses.join(', ')}</p>
                  </div>
              )}
          </div>
      );
  };

  export default CareerCoaching;