import api from './api';

export const generateARVRContent = async (courseId) => {
  try {
    const response = await api.post('/arvr/generate', { courseId });
    return response.data;
  } catch (error) {
    console.error('Failed to generate AR/VR content:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate content');
  }
};
