import api from './api';

export const integrationService = {
  async getIntegrations() {
    try {
      const response = await api.get('/integrations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async connectIntegration(integrationId, config) {
    try {
      const response = await api.post(`/integrations/${integrationId}/connect`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async disconnectIntegration(integrationId) {
    try {
      const response = await api.post(`/integrations/${integrationId}/disconnect`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async syncIntegration(integrationId) {
    try {
      const response = await api.post(`/integrations/${integrationId}/sync`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default integrationService;
