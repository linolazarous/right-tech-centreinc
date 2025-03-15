import React from 'react';
  import ResumeBuilder from '../components/ResumeBuilder';

  const ResumeBuilderPage = () => {
      const userId = localStorage.getItem('userId'); // Replace with actual user ID
      return (
          <div>
              <ResumeBuilder userId={userId} />
          </div>
      );
  };

  export default ResumeBuilderPage;