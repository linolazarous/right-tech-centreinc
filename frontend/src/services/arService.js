import api from './api';

export const arService = {
  async getARLessons(courseId) {
    try {
      const response = await api.get(`/ar/lessons/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createARLesson(lessonData) {
    try {
      const response = await api.post('/ar/lessons', lessonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateARLesson(lessonId, updates) {
    try {
      const response = await api.put(`/ar/lessons/${lessonId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteARLesson(lessonId) {
    try {
      const response = await api.delete(`/ar/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async trackARInteraction(lessonId, interactionData) {
    try {
      const response = await api.post(`/ar/lessons/${lessonId}/interact`, interactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default arService;
