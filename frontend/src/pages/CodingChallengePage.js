import React from 'react';
import CodingChallenge from '../components/CodingChallenge';
import PageLayout from '../layouts/PageLayout';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';

const CodingChallengePage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  return (
    <PageLayout 
      title="Coding Challenges"
      protectedRoute
      seoTitle="Coding Challenges | Right Tech Centre"
      seoDescription="Test and improve your coding skills with our interactive challenges"
    >
      <ErrorBoundary>
        <CodingChallenge userId={currentUser?.id} />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(CodingChallengePage);
