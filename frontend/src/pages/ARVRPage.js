import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import usePageTracking from '../hooks/usePageTracking';
import ARVRIntegration from '../components/ARVRIntegration';
import logger from '../utils/logger';
import ErrorBoundary from '../components/ErrorBoundary';

const ARVRPage = () => {
  usePageTracking();

  useEffect(() => {
    logger.info('User accessed AR/VR page');
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <PageLayout 
      title="Immersive Learning with AR/VR" 
      seoTitle="AR/VR Learning Experiences | Right Tech Centre"
      seoDescription="Explore cutting-edge augmented and virtual reality learning modules"
      seoKeywords="AR education, VR learning, immersive tech, virtual classrooms"
    >
      <ErrorBoundary>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">AR/VR Integration</h1>
          <p className="text-gray-600 mb-8">
            Experience immersive learning with our cutting-edge AR/VR content.
          </p>
          
          <ARVRIntegration />
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-indigo-100 p-1 rounded-full mr-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Interactive 3D models for complex concepts</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-indigo-100 p-1 rounded-full mr-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Virtual labs for hands-on practice</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-indigo-100 p-1 rounded-full mr-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>360° learning environments</span>
              </li>
            </ul>
          </div>
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ARVRPage);

