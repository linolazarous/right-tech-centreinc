import React from 'react';
  import CareerCoaching from '../components/CareerCoaching';

  const CareerCoachingPage = () => {
      const userId = localStorage.getItem('userId'); // Replace with actual user ID
      return (
          <div>
              <CareerCoaching userId={userId} />
          </div>
      );
  };

  export default CareerCoachingPage;