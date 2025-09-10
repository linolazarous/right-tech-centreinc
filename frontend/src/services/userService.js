import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchUserProfile, 
  updateUserProfile,
  requestPasswordReset,
  resetPassword
} from './api';

const userService = {
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  getProfile: fetchUserProfile,
  updateProfile: updateUserProfile,
  requestPasswordReset,
  resetPassword,

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },
};

// Re-export the API functions directly as named exports
export { 
  loginUser as login, 
  registerUser as register, 
  logoutUser as logout, 
  fetchUserProfile, 
  updateUserProfile as updateProfile,
  requestPasswordReset, 
  resetPassword 
};

// Utility methods as named exports
export const getCurrentUser = userService.getCurrentUser;
export const getToken = userService.getToken;
export const isAuthenticated = userService.isAuthenticated;

// Keep default export
export default userService;
