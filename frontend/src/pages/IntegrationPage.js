import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import IntegrationCard from '../components/integrations/IntegrationCard';
import { checkIntegrationHealth } from '../services/integrationService';
import IntegrationSkeleton from '../components/integrations/IntegrationSkeleton';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorAlert from '../components/ui/ErrorAlert';

const IntegrationPage = () => {
  const { currentUser } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  usePageTracking();

  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        logger.debug('Loading integration health checks');
        const healthChecks = await Promise.allSettled([
          checkIntegrationHealth('zoom', currentUser?.id),
          checkIntegrationHealth('google-classroom', currentUser?.id),
          checkIntegrationHealth('microsoft-teams', currentUser?.id)
        ]);

        setIntegrations(healthChecks.map((result, i) => ({
          id: i,
          type: ['zoom', 'google-classroom', 'microsoft-teams'][i],
          status: result.status === 'fulfilled' ? result.value : { 
            healthy: false,
            error: result.reason?.message || 'Check failed'
          }
        })));
      } catch (err) {
        logger.error('Integration health check failed', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      loadIntegrations();
    }
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Integrations" 
      protectedRoute
      seoTitle="Integration Dashboard | Right Tech Centre"
      seoDescription="Manage your learning platform integrations"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <ErrorAlert 
              message="Failed to load integrations" 
              error={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <IntegrationSkeleton count={3} />
              ) : (
                integrations.map((integration) => (
                  <IntegrationCard 
                    key={integration.id}
                    type={integration.type}
                    status={integration.status}
                    userId={currentUser?.id}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(IntegrationPage);
