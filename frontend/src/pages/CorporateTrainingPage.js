import React from 'react';
import CorporateTrainingForm from '../components/CorporateTrainingForm';
import PageLayout from '../layouts/PageLayout';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';

const CorporateTrainingPage = () => {
  usePageTracking();

  return (
    <PageLayout 
      title="Corporate Training Programs"
      seoTitle="Corporate Training | Right Tech Centre"
      seoDescription="Customized training solutions for businesses and organizations"
    >
      <ErrorBoundary>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Corporate Training Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upskill your team with our customized training programs tailored to your business needs
            </p>
          </div>
          <CorporateTrainingForm />
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(CorporateTrainingPage);
