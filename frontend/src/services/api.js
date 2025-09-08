
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from './apiConfig';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const checkAPIHealth = () => api.get(API_ENDPOINTS.HEALTH);

export const getCourses = () => api.get(API_ENDPOINTS.COURSES);

export const getPrograms = () => api.get(API_ENDPOINTS.PROGRAMS);

export const loginUser = (credentials) => 
  api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

export const registerUser = (userData) => 
  api.post(API_ENDPOINTS.AUTH.REGISTER, userData);

export const getUserProfile = () => 
  api.get(API_ENDPOINTS.AUTH.PROFILE);

export const submitContactForm = (formData) => 
  api.post(API_ENDPOINTS.CONTACT, formData);

export default api;
