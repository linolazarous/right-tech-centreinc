import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import ScholarshipManager from '../components/scholarships/ScholarshipManager';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';

const ScholarshipPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Scholarship page accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Scholarships"
      protectedRoute
      seoTitle="Scholarship Opportunities | Right Tech Centre"
      seoDescription="Apply for and manage scholarship applications"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Scholarship Programs</h1>
          <p className="text-gray-600 mb-8">
            Explore and apply for available scholarship opportunities to support 
            your learning journey.
          </p>
          <ScholarshipManager userId={currentUser?.id} />
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ScholarshipPage);
