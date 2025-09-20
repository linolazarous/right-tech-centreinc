// src/services/api.js
import axios from 'axios';

// API Configuration
export const API_BASE_URL = 'https://righttechcentre-kn5oq.ondigitalocean.app/api';
export const API_TIMEOUT = 15000;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
