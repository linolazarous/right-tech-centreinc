import { useState, useEffect, useCallback } from 'react';
import { 
  fetchUserPoints, 
  earnPoints, 
  getUserAchievements, 
  unlockAchievement,
  getLeaderboard,
  getUserLevel,
  completeChallenge,
  getAvailableChallenges
} from '../services/gamificationService';

export const useGamification = (userId) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const [pointsData, levelData, achievementsData, challengesData] = await Promise.all([
        fetchUserPoints(userId),
        getUserLevel(userId),
        getUserAchievements(userId),
        getAvailableChallenges(userId)
      ]);

      setPoints(pointsData.points);
      setLevel(levelData.level);
      setAchievements(achievementsData);
      setChallenges(challengesData);
    } catch (err) {
      setError(err.message || 'Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchLeaderboard = useCallback(async (type = 'global', limit = 10) => {
    try {
      const leaderboardData = await getLeaderboard(type, limit);
      setLeaderboard(leaderboardData);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    }
  }, []);

  const awardPoints = useCallback(async (action, metadata = {}) => {
    try {
      const pointsEarned = await earnPoints(userId, action, metadata);
      setPoints(prev => prev + pointsEarned);
      
      // Add to recent activity
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'points',
          action,
          points: pointsEarned,
          timestamp: new Date().toISOString(),
          metadata
        },
        ...prev.slice(0, 9) // Keep only last 10 activities
      ]);

      return pointsEarned;
    } catch (err) {
      setError(err.message || 'Failed to award points');
      throw err;
    }
  }, [userId]);

  const unlockUserAchievement = useCallback(async (achievementId) => {
    try {
      const achievement = await unlockAchievement(userId, achievementId);
      setAchievements(prev => [...prev, achievement]);
      
      // Add to recent activity
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'achievement',
          achievementId: achievement.id,
          title: achievement.title,
          points: achievement.points,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9)
      ]);

      return achievement;
    } catch (err) {
      setError(err.message || 'Failed to unlock achievement');
      throw err;
    }
  }, [userId]);

  const completeUserChallenge = useCallback(async (challengeId) => {
    try {
      const result = await completeChallenge(userId, challengeId);
      
      if (result.points) {
        setPoints(prev => prev + result.points);
      }

      if (result.achievement) {
        setAchievements(prev => [...prev, result.achievement]);
      }

      // Update challenges list
      setChallenges(prev => prev.filter(challenge => challenge.id !== challengeId));

      // Add to recent activity
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'challenge',
          challengeId,
          points: result.points || 0,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9)
      ]);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to complete challenge');
      throw err;
    }
  }, [userId]);

  const getLevelProgress = useCallback(() => {
    const pointsForNextLevel = level * 1000; // Example: 1000 points per level
    const progress = (points / pointsForNextLevel) * 100;
    return Math.min(progress, 100);
  }, [points, level]);

  const getNextLevelPoints = useCallback(() => {
    return level * 1000; // Example: 1000 points per level
  }, [level]);

  const getRank = useCallback(() => {
    if (!leaderboard.length) return null;
    const userRank = leaderboard.findIndex(item => item.userId === userId);
    return userRank !== -1 ? userRank + 1 : null;
  }, [leaderboard, userId]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Load leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    // State
    points,
    level,
    achievements,
    leaderboard,
    challenges,
    recentActivity,
    loading,
    error,

    // Functions
    awardPoints,
    unlockAchievement: unlockUserAchievement,
    completeChallenge: completeUserChallenge,
    fetchLeaderboard,
    refetch: fetchUserData,
    getLevelProgress,
    getNextLevelPoints,
    getRank,
    resetError,

    // Derived data
    totalAchievements: achievements.length,
    completedChallenges: challenges.filter(c => c.completed).length,
    pendingChallenges: challenges.filter(c => !c.completed).length,
    isMaxLevel: level >= 100 // Example max level
  };
};

export default useGamification;
