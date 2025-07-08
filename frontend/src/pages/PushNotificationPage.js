import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import NotificationPreferences from '../components/notifications/NotificationPreferences';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';

const PushNotificationPage = () => {
  const { currentUser } = useAuth();
  usePageTracking();

  useEffect(() => {
    logger.info('Notification settings accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  return (
    <PageLayout 
      title="Notification Settings"
      protectedRoute
      seoTitle="Notification Preferences | Right Tech Centre"
      seoDescription="Manage your notification preferences"
    >
      <ErrorBoundary>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>
          <p className="text-gray-600 mb-8">
            Customize how you receive updates and alerts from our platform.
          </p>
          <NotificationPreferences userId={currentUser?.id} />
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(PushNotificationPage);
