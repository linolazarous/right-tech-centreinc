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
  // Use the imported API functions
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  getProfile: fetchUserProfile,
  updateProfile: updateUserProfile,
  requestPasswordReset,
  resetPassword,

  // Keep your utility methods
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

  // ... rest of your utility methods
};

export default userService;
