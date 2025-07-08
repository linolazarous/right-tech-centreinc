import api from './api';

export const allocateScholarship = async (studentId, criteria) => {
  try {
    const response = await api.post('/scholarships/allocate', { studentId, criteria });
    return response.data;
  } catch (error) {
    console.error('Failed to allocate scholarship:', error);
    throw new Error(error.response?.data?.message || 'Failed to allocate scholarship');
  }
};
