import UserModel from '../models/UserModel.js';
import validator from 'validator';

/**
 * Validate user registration data
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
export const validateUserRegistration = (userData) => {
  const { name, email, password, role } = userData;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' };
  }

  if (name.trim().length > 50) {
    return { valid: false, message: 'Name cannot exceed 50 characters' };
  }

  // Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  if (email.length > 100) {
    return { valid: false, message: 'Email cannot exceed 100 characters' };
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, message: 'Password cannot exceed 128 characters' };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' };
  }

  // Role validation
  const validRoles = ['student', 'instructor', 'admin', 'user'];
  if (role && !validRoles.includes(role)) {
    return { valid: false, message: 'Invalid user role' };
  }

  return { valid: true, message: 'User registration data is valid' };
};

/**
 * Validate user login data
 * @param {Object} loginData - Login data to validate
 * @returns {Object} Validation result
 */
export const validateUserLogin = (loginData) => {
  const { email, password } = loginData;

  // Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length === 0) {
    return { valid: false, message: 'Password cannot be empty' };
  }

  return { valid: true, message: 'User login data is valid' };
};

/**
 * Validate user profile update data
 * @param {Object} updateData - Update data to validate
 * @returns {Object} Validation result
 */
export const validateUserProfileUpdate = (updateData) => {
  const { name, bio, avatar, location, website, skills } = updateData;

  // Name validation
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return { valid: false, message: 'Name cannot be empty' };
    }

    if (name.trim().length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters long' };
    }

    if (name.trim().length > 50) {
      return { valid: false, message: 'Name cannot exceed 50 characters' };
    }
  }

  // Bio validation
  if (bio !== undefined) {
    if (typeof bio !== 'string') {
      return { valid: false, message: 'Bio must be a string' };
    }

    if (bio.length > 500) {
      return { valid: false, message: 'Bio cannot exceed 500 characters' };
    }
  }

  // Avatar URL validation
  if (avatar !== undefined) {
    if (typeof avatar !== 'string') {
      return { valid: false, message: 'Avatar must be a URL string' };
    }

    if (avatar && !validator.isURL(avatar)) {
      return { valid: false, message: 'Invalid avatar URL format' };
    }

    if (avatar && avatar.length > 500) {
      return { valid: false, message: 'Avatar URL cannot exceed 500 characters' };
    }
  }

  // Location validation
  if (location !== undefined) {
    if (typeof location !== 'string') {
      return { valid: false, message: 'Location must be a string' };
    }

    if (location.length > 100) {
      return { valid: false, message: 'Location cannot exceed 100 characters' };
    }
  }

  // Website validation
  if (website !== undefined) {
    if (typeof website !== 'string') {
      return { valid: false, message: 'Website must be a string' };
    }

    if (website && !validator.isURL(website)) {
      return { valid: false, message: 'Invalid website URL format' };
    }

    if (website && website.length > 200) {
      return { valid: false, message: 'Website URL cannot exceed 200 characters' };
    }
  }

  // Skills validation
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      return { valid: false, message: 'Skills must be an array' };
    }

    if (skills.length > 50) {
      return { valid: false, message: 'Cannot have more than 50 skills' };
    }

    for (const skill of skills) {
      if (typeof skill !== 'string' || skill.trim().length === 0) {
        return { valid: false, message: 'All skills must be non-empty strings' };
      }

      if (skill.length > 30) {
        return { valid: false, message: 'Skill name cannot exceed 30 characters' };
      }
    }
  }

  // Check if at least one field is being updated
  const hasUpdates = Object.keys(updateData).length > 0;
  if (!hasUpdates) {
    return { valid: false, message: 'No update data provided' };
  }

  return { valid: true, message: 'User profile update data is valid' };
};

/**
 * Validate user ID
 * @param {string} userId - User ID to validate
 * @returns {Object} Validation result
 */
export const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return { valid: false, message: 'User ID is required' };
  }

  if (!validator.isMongoId(userId)) {
    return { valid: false, message: 'Invalid user ID format' };
  }

  return { valid: true, message: 'User ID is valid' };
};

/**
 * Validate password change data
 * @param {Object} passwordData - Password change data
 * @returns {Object} Validation result
 */
export const validatePasswordChange = (passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  // Current password validation
  if (!currentPassword || typeof currentPassword !== 'string') {
    return { valid: false, message: 'Current password is required' };
  }

  if (currentPassword.length === 0) {
    return { valid: false, message: 'Current password cannot be empty' };
  }

  // New password validation
  if (!newPassword || typeof newPassword !== 'string') {
    return { valid: false, message: 'New password is required' };
  }

  if (newPassword.length < 8) {
    return { valid: false, message: 'New password must be at least 8 characters long' };
  }

  if (newPassword.length > 128) {
    return { valid: false, message: 'New password cannot exceed 128 characters' };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return { valid: false, message: 'New password must contain at least one lowercase letter, one uppercase letter, and one number' };
  }

  // Check if passwords are different
  if (currentPassword === newPassword) {
    return { valid: false, message: 'New password must be different from current password' };
  }

  return { valid: true, message: 'Password change data is valid' };
};

/**
 * Validate email for password reset
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  if (email.length > 100) {
    return { valid: false, message: 'Email cannot exceed 100 characters' };
  }

  return { valid: true, message: 'Email is valid' };
};

export default {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validateUserId,
  validatePasswordChange,
  validateEmail
};
