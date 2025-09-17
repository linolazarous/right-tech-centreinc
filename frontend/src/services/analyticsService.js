import api from './api';

const ANALYTICS_ENDPOINTS = {
  STUDENT_PROGRESS: (userId) => `/api/analytics/student-progress/${userId}`,
  ENGAGEMENT_METRICS: (userId) => `/api/analytics/engagement-metrics/${userId}`,
};

export const getStudentProgress = async (userId) => {
  try {
    const response = await api.get(ANALYTICS_ENDPOINTS.STUDENT_PROGRESS(userId));
    return response.data;
  } catch (error) {
    console.error('Failed to get student progress:', error);
    throw error;
  }
};

export const getEngagementMetrics = async (userId) => {
  try {
    const response = await api.get(ANALYTICS_ENDPOINTS.ENGAGEMENT_METRICS(userId));
    return response.data;
  } catch (error) {
    console.error('Failed to get engagement metrics:', error);
    throw error;
  }
};
