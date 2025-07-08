import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import InterviewPreparation from '../components/InterviewPreparation';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewPreparationPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Interview preparation page accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Interview Preparation"
      protectedRoute
      seoTitle="Tech Interview Preparation | Right Tech Centre"
      seoDescription="Prepare for technical interviews with our comprehensive resources and mock interviews"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!currentUser ? (
            <LoadingSpinner />
          ) : (
            <InterviewPreparation userId={currentUser.id} />
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(InterviewPreparationPage);
