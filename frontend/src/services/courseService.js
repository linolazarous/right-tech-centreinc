import api from './api';

export const fetchCourses = async () => {
  try {
    const response = await api.get('/courses', {
      params: {
        include: 'instructor,reviews'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to load courses');
  }
};
