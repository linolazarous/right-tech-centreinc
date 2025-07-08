import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import StudyGroupList from '../components/community/StudyGroupList';
import { useStudyGroups } from '../hooks/useStudyGroups';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

const StudyGroupPage = () => {
  const { currentUser } = useAuth();
  const { groups, loading, error, refetch } = useStudyGroups(currentUser?.id);
  usePageTracking();

  useEffect(() => {
    if (!loading && groups) {
      logger.info('Study groups loaded', {
        userId: currentUser?.id,
        groupCount: groups.length
      });
    }
  }, [groups, loading, currentUser?.id]);

  return (
    <PageLayout 
      title="Study Groups" 
      protectedRoute
      seoTitle="Study Groups | Right Tech Centre"
      seoDescription="Join or create study groups to collaborate with peers"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorAlert 
              message="Failed to load study groups"
              error={error}
              onRetry={refetch}
            />
          ) : (
            <StudyGroupList 
              groups={groups}
              loading={loading}
              error={error}
              userId={currentUser?.id}
              onRefresh={refetch}
              className="bg-white rounded-lg shadow-lg"
            />
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(StudyGroupPage);
