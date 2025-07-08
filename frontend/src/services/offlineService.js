import api from './api';

export const downloadCourse = async (courseId) => {
  try {
    const response = await api.get(`/offline/download/${courseId}`, {
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  } catch (error) {
    console.error('Failed to download course:', error);
    throw new Error(error.response?.data?.message || 'Failed to download course');
  }
};
