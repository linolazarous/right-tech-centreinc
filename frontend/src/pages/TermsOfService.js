import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import termsContent from '../content/terms';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';

const TermsOfService = () => {
  usePageTracking();

  useEffect(() => {
    logger.info('Terms of service viewed');
  }, []);

  return (
    <PageLayout 
      title="Terms of Service"
      seoTitle="Terms of Service | Right Tech Centre"
      seoDescription="Legal terms governing the use of our platform"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-lg text-gray-700">
            {termsContent.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {Array.isArray(section.content) ? (
                    section.content.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default React.memo(TermsOfService);
