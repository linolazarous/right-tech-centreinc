import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCertificate } from '../hooks/useCertificate';
import PageLayout from '../layouts/PageLayout';
import CertificateView from '../components/certificates/CertificateView';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const CertificatePage = () => {
  const { id } = useParams();
  const { certificate, loading, error } = useCertificate(id);
  usePageTracking();

  useEffect(() => {
    logger.info('Certificate viewed', { certificateId: id });
  }, [id]);

  return (
    <PageLayout 
      title={certificate?.title || 'Certificate Verification'}
      seoTitle={`${certificate?.title || 'Certificate'} | Right Tech Centre`}
      seoDescription="Verify and view your digital certificates"
    >
      <ErrorBoundary>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CertificateView 
            certificate={certificate}
            loading={loading}
            error={error}
          />
        )}
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(CertificatePage);
