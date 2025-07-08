import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTracking } from '../hooks/usePageTracking';

const AnalyticsPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  usePageTracking();

  useEffect(() => {
    if (currentUser) {
      logger.info('User accessed analytics dashboard', {
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
      title="Learning Analytics" 
      protectedRoute
      seoTitle="Learning Analytics Dashboard | Right Tech Centre"
      seoDescription="Track your learning progress and performance metrics"
    >
      <ErrorBoundary>
        <AnalyticsDashboard userId={currentUser?.id} />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(AnalyticsPage);
