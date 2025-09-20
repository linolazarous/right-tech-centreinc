// src/config/endpoints.js
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    DELETE: '/users/delete',
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    STATS: '/admin/stats',
    COURSES: '/admin/courses',
    // Add more admin endpoints as needed
  },
  
  // Course endpoints
  COURSES: {
    LIST: '/courses',
    DETAIL: '/courses/:id',
    ENROLL: '/courses/:id/enroll',
    PROGRESS: '/courses/:id/progress',
  },
  
  // Live classes
  LIVE_CLASSES: {
    LIST: '/live-classes',
    JOIN: '/live-classes/:id/join',
    SCHEDULE: '/live-classes/schedule',
  },
  
  // Forum
  FORUM: {
    POSTS: '/forum/posts',
    CREATE: '/forum/posts/create',
    COMMENTS: '/forum/posts/:id/comments',
    LIKE: '/forum/posts/:id/like',
  },
  
  // Contact
  CONTACT: '/contact',
};

export default API_ENDPOINTS;
