import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.righttechcentre.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for auth headers
api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader.Authorization;
  }
  return config;
});

export const fetchCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to load courses');
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to load user profile');
  }
};
