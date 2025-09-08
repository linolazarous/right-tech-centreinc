
// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://righttechcentre-iyysq.ondigitalocean.app' 
    : '');

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  COURSES: '/api/courses',
  PROGRAMS: '/api/programs',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  CONTACT: '/api/contact'
};

export default API_BASE_URL;
