import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { generate2FASecret, verify2FAToken } from '../services/authService.js';
import { isValidObjectId } from '../utils/helpers.js';
import logger from '../utils/logger.js';

// ** NEW: Moved from adminController.js **
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        twoFAEnabled: user.twoFAEnabled
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// ** NEW: Moved from adminController.js **
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.twoFAEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        message: '2FA verification required'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      requires2FA: false,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        twoFAEnabled: user.twoFAEnabled
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// ** NEW: Moved from adminController.js **
export const verify2FALogin = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    if (!token || typeof token !== 'string' || token.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token format'
      });
    }

    const user = await User.findById(userId).select('+twoFASecret');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.twoFAEnabled || !user.twoFASecret) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled for this user'
      });
    }

    const isValid = verify2FAToken(user.twoFASecret, token);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    const authToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        twoFAEnabled: user.twoFAEnabled
      }
    });
  } catch (error) {
    logger.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: '2FA verification failed'
    });
  }
};

// ** NEW: Moved from adminController.js **
export const getAuthStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      isAdmin: req.user.role === 'admin',
      isInstructor: req.user.role === 'instructor',
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        avatar: req.user.avatar,
        twoFAEnabled: req.user.twoFAEnabled
      }
    });
  } catch (error) {
    logger.error('Auth status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get auth status'
    });
  }
};

// ** NEW: Moved from adminController.js **
export const enable2FA = async (req, res) => {
  const { userId } = req.body;
  
  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.twoFAEnabled) {
      return res.status(400).json({ 
        success: false,
        message: '2FA is already enabled for this user' 
      });
    }

    const secret = generate2FASecret(user.email);
    
    logger.info(`2FA setup initiated for user: ${userId}`);
    res.status(200).json({ 
      success: true,
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      message: 'Scan QR code with authenticator app and verify'
    });
  } catch (err) {
    logger.error(`Error enabling 2FA: ${err.message}`, { stack: err.stack });
    res.status(500).json({ 
      success: false,
      message: 'Failed to enable 2FA',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ** NEW: Moved from adminController.js **
export const verify2FA = async (req, res) => {
  const { userId, token, secret } = req.body;
  
  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }

    if (!token || typeof token !== 'string' || token.length !== 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid token format' 
      });
    }

    const user = await User.findById(userId).select('+twoFASecret');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const isValid = verify2FAToken(secret || user.twoFASecret, token);
    
    if (isValid) {
      if (!user.twoFAEnabled) {
        user.twoFASecret = secret;
        user.twoFAEnabled = true;
        await user.save();
        logger.info(`2FA successfully enabled for user: ${userId}`);
      } else {
        logger.info(`2FA successfully verified for user: ${userId}`);
      }
      
      return res.status(200).json({ 
        success: true,
        message: "2FA verified successfully",
        twoFAEnabled: user.twoFAEnabled
      });
    }
    
    logger.warn(`Invalid 2FA token provided for user: ${userId}`);
    res.status(401).json({ 
      success: false,
      message: "Invalid 2FA token" 
    });
  } catch (err) {
    logger.error(`Error verifying 2FA: ${err.message}`, { stack: err.stack });
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify 2FA',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ** NEW: Moved from adminController.js **
export const disable2FA = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    user.twoFAEnabled = false;
    user.twoFASecret = undefined;
    await user.save();

    logger.info(`2FA disabled for user: ${userId}`);
    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    logger.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    });
  }
};

