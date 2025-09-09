import api from './api';

export const vrService = {
  async getVRLessons(courseId) {
    try {
      const response = await api.get(`/vr/lessons/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createVRLesson(lessonData) {
    try {
      const response = await api.post('/vr/lessons', lessonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateVRLesson(lessonId, updates) {
    try {
      const response = await api.put(`/vr/lessons/${lessonId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteVRLesson(lessonId) {
    try {
      const response = await api.delete(`/vr/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async trackVRProgress(lessonId, progressData) {
    try {
      const response = await api.post(`/vr/lessons/${lessonId}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default vrService;
