import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LearningPaths from '../components/learning/LearningPath';
import PageLayout from '../layouts/PageLayout';
import useLearningPaths from '../hooks/useLearningPaths';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

const LearningPathPage = () => {
  const { currentUser } = useAuth();
  const { paths, loading, error, refetch } = useLearningPaths(currentUser?.id);
  usePageTracking();

  useEffect(() => {
    if (paths) {
      logger.info('Learning paths loaded', {
        userId: currentUser?.id,
        pathCount: paths.length
      });
    }
  }, [paths, currentUser?.id]);

  return (
    <PageLayout 
      title="My Learning Paths" 
      protectedRoute
      seoTitle="Personalized Learning Paths | Right Tech Centre"
      seoDescription="Track and manage your customized learning journey"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorAlert 
              message="Failed to load learning paths"
              error={error}
              onRetry={refetch}
            />
          ) : (
            <LearningPaths 
              paths={paths} 
              loading={loading}
              error={error}
              onRefresh={refetch}
              className="bg-white rounded-lg shadow"
            />
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(LearningPathPage);
