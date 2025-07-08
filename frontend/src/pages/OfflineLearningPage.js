import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import OfflineContentManager from '../components/learning/OfflineContentManager';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';

const OfflinePage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Offline learning page accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Offline Learning"
      protectedRoute
      seoTitle="Offline Course Access | Right Tech Centre"
      seoDescription="Download course materials for offline learning"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Offline Learning</h1>
          <p className="text-gray-600 mb-8">
            Download course materials for offline access. Available content will 
            be synced when you're back online.
          </p>
          <OfflineContentManager userId={currentUser?.id} />
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(OfflinePage);
