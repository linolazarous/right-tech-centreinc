import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CareerPathRecommendation from '../components/CareerPathRecommendation';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';

const CareerPathPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    if (currentUser) {
      logger.info('User accessed career path recommendations');
    }
  }, [currentUser]);

  return (
    <PageLayout 
      title="Career Path Recommendations" 
      protectedRoute
      seoTitle="Career Path Recommendations | Right Tech Centre"
      seoDescription="Discover personalized career paths based on your skills and interests"
    >
      <ErrorBoundary>
        <CareerPathRecommendation userId={currentUser?.id} />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(CareerPathPage);
