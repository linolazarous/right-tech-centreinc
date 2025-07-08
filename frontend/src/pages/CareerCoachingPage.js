import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CareerCoaching from '../components/career/CareerCoaching';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const CareerCoachingPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  usePageTracking();

  useEffect(() => {
    if (currentUser) {
      logger.info('User accessed career coaching', {
        userId: currentUser.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentUser]);

  if (authLoading) {
    return (
      <PageLayout>
        <LoadingSpinner fullScreen />
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Career Coaching" 
      protectedRoute
      seoTitle="Career Coaching | Right Tech Centre"
      seoDescription="Get personalized career guidance and coaching from industry experts"
    >
      <ErrorBoundary>
        <CareerCoaching userId={currentUser?.id} />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(CareerCoachingPage);
