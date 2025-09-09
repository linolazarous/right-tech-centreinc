import api from './api';

export const jobService = {
  async getJobListings(filters = {}) {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getJobDetails(jobId) {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async applyForJob(jobId, applicationData) {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAppliedJobs() {
    try {
      const response = await api.get('/jobs/applied');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async saveJob(jobId) {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getSavedJobs() {
    try {
      const response = await api.get('/jobs/saved');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default jobService;
