import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchUserProfile, 
  updateUserProfile,
  requestPasswordReset,
  resetPassword
} from './api';

// Your existing service object
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

// Add named exports for individual functions
export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;
export const getProfile = fetchUserProfile;
export const updateProfile = updateUserProfile;
export { requestPasswordReset, resetPassword };

// Utility methods as named exports
export const getCurrentUser = userService.getCurrentUser;
export const getToken = userService.getToken;
export const isAuthenticated = userService.isAuthenticated;

// Keep default export
export default userService;
