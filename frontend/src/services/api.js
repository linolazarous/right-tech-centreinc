import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for auth headers
api.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader.Authorization;
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
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token if refresh token endpoint exists
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = refreshResponse.data;
          
          if (token) {
            localStorage.setItem('authToken', token);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Continue with normal error handling
      }
      
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      window.dispatchEvent(new Event('unauthorized'));
    }
    
    // Convert to a standard error format
    const apiError = new Error(error.response?.data?.message || error.message || 'API request failed');
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;
    
    return Promise.reject(apiError);
  }
);

// API endpoints - Keep your existing endpoints
export const fetchCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const response = await api.put(`/api/users/${userId}`, updates);
    
    // Update local user data if the current user's profile was updated
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    if (currentUser._id === userId) {
      localStorage.setItem('userData', JSON.stringify({ ...currentUser, ...updates }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export const fetchPrograms = async () => {
  try {
    const response = await api.get('/api/programs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/api/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    throw error;
  }
};

export const uploadFile = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Utility function to check API health
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// Add logout function
export const logoutUser = async () => {
  try {
    // Call logout endpoint if it exists
    await api.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Still clear local storage even if API call fails
  } finally {
    // Always clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }
};

// Add password reset functions
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

export const resetPassword = async (token, passwordData) => {
  try {
    const response = await api.post(`/api/auth/reset-password/${token}`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

export default api;
