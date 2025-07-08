import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile } from '../services/userService';
import PageLayout from '../layouts/PageLayout';
import ProfileSection from '../components/profile/ProfileSection';
import EnrolledCourses from '../components/profile/EnrolledCourses';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  usePageTracking();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        logger.debug('Loading user profile', { userId: currentUser?.id });
        const data = await fetchUserProfile(currentUser?.id);
        setProfile(data);
        logger.info('User profile loaded', {
          userId: currentUser?.id,
          courseCount: data.coursesEnrolled?.length || 0
        });
      } catch (err) {
        logger.error('Failed to load profile', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      loadProfile();
    }
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="My Profile" 
      protectedRoute
      seoTitle="My Learning Profile | Right Tech Centre"
      seoDescription="View and manage your learning profile and progress"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <LoadingSpinner fullScreen />
          ) : error ? (
            <ErrorAlert 
              message="Failed to load profile"
              error={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="space-y-8">
              <ProfileSection 
                user={profile} 
                className="bg-white shadow rounded-lg p-6"
              />
              <EnrolledCourses 
                courses={profile.coursesEnrolled} 
                className="bg-white shadow rounded-lg p-6"
              />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ProfilePage);
