import api from './api';

const userService = {
  // User Authentication
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      return response.data;
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      throw error.response?.data || error.message;
    }
  },

  // User Profile Management
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      // Update local storage if user data is returned
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User Management (Admin functions)
  async getAllUsers(params = {}) {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Course Enrollment
  async enrollInCourse(courseId) {
    try {
      const response = await api.post(`/users/enroll/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getEnrolledCourses() {
    try {
      const response = await api.get('/users/courses');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/users/courses/${courseId}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateCourseProgress(courseId, progressData) {
    try {
      const response = await api.put(`/users/courses/${courseId}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Password Reset
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async resetPassword(token, passwordData) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Email Verification
  async verifyEmail(token) {
    try {
      const response = await api.post(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async resendVerificationEmail() {
    try {
      const response = await api.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Utility Methods
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
    return localStorage.getItem('userToken');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  isInstructor() {
    const user = this.getCurrentUser();
    return user && (user.role === 'instructor' || user.role === 'admin');
  },

  // Clear user data (for logout or token expiration)
  clearUserData() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      this.clearUserData();
      throw error.response?.data || error.message;
    }
  }
};

export default userService;
