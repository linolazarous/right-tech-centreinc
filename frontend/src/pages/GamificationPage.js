import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import Leaderboard from '../components/gamification/Leaderboard';
import AchievementTracker from '../components/gamification/AchievementTracker';
import useGamification from '../hooks/useGamification';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSkeleton from '../components/gamification/LoadingSkeleton';
import GamificationError from '../components/gamification/GamificationError';

const GamificationPage = () => {
  const { currentUser } = useAuth();
  const {
    stats,
    leaderboard,
    achievements,
    loading,
    error,
    refreshData
  } = useGamification(currentUser?.id);
  usePageTracking();

  useEffect(() => {
    logger.info('Gamification page accessed', {
      userId: currentUser?.id,
      achievementCount: achievements?.length || 0
    });

    const timer = setInterval(() => {
      refreshData();
      logger.debug('Refreshing gamification data');
    }, 30000); // Refresh every 30s

    return () => clearInterval(timer);
  }, [currentUser?.id, achievements?.length, refreshData]);

  return (
    <PageLayout 
      title="Learning Achievements" 
      protectedRoute
      seoTitle="Your Learning Progress | Right Tech Centre"
      seoDescription="Track your learning achievements, badges, and leaderboard position"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <GamificationError error={error} onRetry={refreshData} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AchievementTracker 
                  achievements={achievements}
                  currentStats={stats}
                />
              </div>
              <div className="space-y-6">
                <Leaderboard 
                  data={leaderboard}
                  currentUserId={currentUser?.id}
                />
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-4">Your Progress</h3>
                  {/* Progress visualization components */}
                </div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(GamificationPage);
