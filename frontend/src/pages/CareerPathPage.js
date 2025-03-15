import React from 'react';
  import CareerPathRecommendation from '../components/CareerPathRecommendation';

  const CareerPathPage = () => {
      const userId = localStorage.getItem('userId'); // Replace with actual user ID
      return (
          <div>
              <CareerPathRecommendation userId={userId} />
          </div>
      );
  };

  export default CareerPathPage;