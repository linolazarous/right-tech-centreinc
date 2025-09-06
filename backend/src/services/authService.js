import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';
import logger from '../utils/logger.js';
import { validateUserRegistration } from '../validators/userValidator.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async register(userData) {
    try {
      const validation = validateUserRegistration(userData);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      const { email, password } = userData;
      
      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const newUser = new UserModel({ 
        ...userData, 
        password: hashedPassword 
      });
      
      await newUser.save();
      logger.info(`User registered: ${newUser._id}`);

      // Generate token
      const token = this.generateToken(newUser._id);
      
      return { 
        user: newUser.toObject({ virtuals: true }),
        token 
      };
    } catch (error) {
      logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User and token
   */
  static async login(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user._id);
      
      logger.info(`User logged in: ${user._id}`);
      return { 
        user: user.toObject({ virtuals: true }),
        token 
      };
    } catch (error) {
      logger.error(`Login failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} JWT token
   */
  static generateToken(userId) {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }
}

export default AuthService;
