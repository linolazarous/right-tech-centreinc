import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getJobRecommendations } from '../services/jobService';
import PageLayout from '../layouts/PageLayout';
import JobFilters from '../components/JobFilters';
import JobList from '../components/JobList';
import LoadingSpinner from '../components/LoadingSpinner';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorAlert from '../components/ui/ErrorAlert';

const JobPortalPage = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    remoteOnly: false,
    experienceLevel: '',
    skills: []
  });
  usePageTracking();

  useEffect(() => {
    const loadJobs = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        logger.debug('Loading job recommendations', { filters });
        const data = await getJobRecommendations(currentUser.id, filters);
        setJobs(data);
        logger.info('Job recommendations loaded', {
          count: data.length,
          filters
        });
      } catch (err) {
        logger.error('Failed to load jobs', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [currentUser?.id, filters]);

  return (
    <PageLayout 
      title="Job Portal" 
      protectedRoute
      seoTitle="Tech Job Portal | Right Tech Centre"
      seoDescription="Find your next tech job with our personalized job recommendations"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {error ? (
            <ErrorAlert 
              message="Failed to load job recommendations"
              error={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <JobFilters 
                filters={filters} 
                onFilterChange={setFilters} 
                className="bg-white p-6 rounded-lg shadow"
              />
              {loading ? (
                <LoadingSpinner />
              ) : (
                <JobList 
                  jobs={jobs} 
                  className="bg-white rounded-lg shadow overflow-hidden"
                />
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(JobPortalPage);
