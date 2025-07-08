import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import LocalizationManager from '../components/content/LocalizationManager';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const ContentLocalizationPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  usePageTracking();

  useEffect(() => {
    if (currentUser) {
      logger.info('User accessed content localization', {
        userId: currentUser.id,
        role: currentUser.role
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
      title="Content Localization" 
      protectedRoute
      seoTitle="Content Localization | Right Tech Centre"
      seoDescription="Manage and localize content for different regions and languages"
    >
      <ErrorBoundary>
        <LocalizationManager 
          userId={currentUser?.id}
          role={currentUser?.role}
        />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ContentLocalizationPage);
