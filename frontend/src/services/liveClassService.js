import api from './api';

export const fetchLiveClasses = async () => {
  try {
    const response = await api.get('/live-classes');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch live classes:', error);
    throw new Error(error.response?.data?.message || 'Failed to load live classes');
  }
};
