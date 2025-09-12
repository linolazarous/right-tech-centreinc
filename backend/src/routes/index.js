import authRoutes from './auth.js';
import userRoutes from './users.js';
import adminRoutes from './admin.js';

// Export as an object for easy importing
export {
  authRoutes,
  userRoutes,
  adminRoutes
};

// Default export for easy use in server.js
export default {
  authRoutes,
  userRoutes,
  adminRoutes
};
