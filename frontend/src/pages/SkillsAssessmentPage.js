import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import SkillAssessment from '../components/SkillAssessment';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const SkillAssessmentPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Skill assessment accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Skill Assessment"
      protectedRoute
      seoTitle="Technical Skill Assessment | Right Tech Centre"
      seoDescription="Evaluate your technical skills and identify areas for improvement"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!currentUser ? (
            <LoadingSpinner />
          ) : (
            <SkillAssessment 
              userId={currentUser.id}
              className="bg-white rounded-lg shadow-lg p-6"
            />
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(SkillAssessmentPage);
