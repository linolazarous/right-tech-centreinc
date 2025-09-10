import api from './api';

export const fetchUserPoints = async (userId) => {
  try {
    const response = await api.get(`/gamification/users/${userId}/points`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user points:', error);
    throw new Error(error.response?.data?.message || 'Failed to load points');
  }
};

export const earnPoints = async (userId, action, metadata = {}) => {
  try {
    const response = await api.post(`/gamification/users/${userId}/points`, {
      action,
      metadata
    });
    return response.data.pointsEarned;
  } catch (error) {
    console.error('Failed to earn points:', error);
    throw new Error(error.response?.data?.message || 'Failed to earn points');
  }
};

export const getUserLevel = async (userId) => {
  try {
    const response = await api.get(`/gamification/users/${userId}/level`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user level:', error);
    throw new Error(error.response?.data?.message || 'Failed to load level');
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const response = await api.get(`/gamification/users/${userId}/achievements`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    throw new Error(error.response?.data?.message || 'Failed to load achievements');
  }
};

export const unlockAchievement = async (userId, achievementId) => {
  try {
    const response = await api.post(`/gamification/users/${userId}/achievements`, {
      achievementId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to unlock achievement:', error);
    throw new Error(error.response?.data?.message || 'Failed to unlock achievement');
  }
};

export const getLeaderboard = async (type = 'global', limit = 10) => {
  try {
    const response = await api.get(`/gamification/leaderboard?type=${type}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to load leaderboard');
  }
};

export const getAvailableChallenges = async (userId) => {
  try {
    const response = await api.get(`/gamification/users/${userId}/challenges`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    throw new Error(error.response?.data?.message || 'Failed to load challenges');
  }
};

export const completeChallenge = async (userId, challengeId) => {
  try {
    const response = await api.post(`/gamification/users/${userId}/challenges/${challengeId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Failed to complete challenge:', error);
    throw new Error(error.response?.data?.message || 'Failed to complete challenge');
  }
};

export default {
  fetchUserPoints,
  earnPoints,
  getUserLevel,
  getUserAchievements,
  unlockAchievement,
  getLeaderboard,
  getAvailableChallenges,
  completeChallenge
};
