import api from './api';

export const getJobRecommendations = async (userId) => {
  try {
    const response = await api.get(`/jobs/recommendations/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get job recommendations:', error);
    throw new Error(error.response?.data?.message || 'Failed to load recommendations');
  }
};
