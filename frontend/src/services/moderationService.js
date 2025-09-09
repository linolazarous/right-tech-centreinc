import api from './api';

export const moderationService = {
  async getPendingContent() {
    try {
      const response = await api.get('/moderation/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async approveContent(contentId) {
    try {
      const response = await api.post(`/moderation/approve/${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async rejectContent(contentId, reason) {
    try {
      const response = await api.post(`/moderation/reject/${contentId}`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getModerationStats() {
    try {
      const response = await api.get('/moderation/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default moderationService;
