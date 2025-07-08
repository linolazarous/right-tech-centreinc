import api from './api';

export const createTraining = async (trainingData) => {
  try {
    const response = await api.post('/corporate/training', trainingData);
    return response.data;
  } catch (error) {
    console.error('Failed to create training:', error);
    throw new Error(error.response?.data?.message || 'Failed to create training');
  }
};
