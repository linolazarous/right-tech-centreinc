import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ResumeBuilder from '../components/career/ResumeBuilder';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeBuilderPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Resume builder accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Resume Builder" 
      protectedRoute
      seoTitle="Professional Resume Builder | Right Tech Centre"
      seoDescription="Create and customize your professional resume"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!currentUser ? (
            <LoadingSpinner />
          ) : (
            <ResumeBuilder 
              userId={currentUser.id} 
              className="bg-white rounded-lg shadow-lg"
            />
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ResumeBuilderPage);
