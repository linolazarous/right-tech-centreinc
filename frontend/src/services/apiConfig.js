
// API Configuration Constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : 'https://righttechcentre-kn5oq.ondigitalocean.app');

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/api/users/profile',
    BY_ID: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
    AVATAR: (id) => `/api/users/${id}/avatar`,
  },
  
  // Course endpoints
  COURSES: {
    LIST: '/api/courses',
    BY_ID: (id) => `/api/courses/${id}`,
    ENROLL: (id) => `/api/courses/${id}/enroll`,
    PROGRESS: (id) => `/api/courses/${id}/progress`,
    MODULES: (id) => `/api/courses/${id}/modules`,
  },
  
  // Program endpoints
  PROGRAMS: {
    LIST: '/api/programs',
    BY_ID: (id) => `/api/programs/${id}`,
  },
  
  // Other endpoints
  CONTACT: '/api/contact',
  UPLOAD: '/api/upload',
  HEALTH: '/api/health',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  DEFAULT: 'Something went wrong. Please try again.',
};

export default API_BASE_URL;
                
