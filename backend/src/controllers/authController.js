// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import { generate2FASecret, verify2FAToken } from '../services/authService.js';
import { isValidObjectId } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

const signToken = (user) => jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: 'User already exists' });

    const user = new UserModel({ email, password, firstName, lastName, role });
    await user.save();

    const token = signToken(user);
    logger.info('New user registered', { email });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, twoFAEnabled: user.twoFAEnabled }
    });
  } catch (err) {
    logger.error('Registration error', { message: err.message, stack: err.stack });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: Object.values(err.errors).map(e => e.message) });
    }
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await UserModel.findOne({ email }).select('+password +twoFASecret');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.twoFAEnabled) {
      return res.status(200).json({ success: true, requires2FA: true, userId: user._id });
    }

    const token = signToken(user);
    return res.json({ success: true, requires2FA: false, token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, twoFAEnabled: user.twoFAEnabled } });
  } catch (err) {
    logger.error('Login error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const verify2FALogin = async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!isValidObjectId(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });
    if (!token || typeof token !== 'string') return res.status(400).json({ success: false, message: 'Invalid token format' });

    const user = await UserModel.findById(userId).select('+twoFASecret +password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.twoFAEnabled || !user.twoFASecret) return res.status(400).json({ success: false, message: '2FA not enabled' });

    if (!verify2FAToken(user.twoFASecret, token)) {
      return res.status(401).json({ success: false, message: 'Invalid 2FA token' });
    }

    const authToken = signToken(user);
    return res.json({ success: true, token: authToken, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    logger.error('2FA login error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: '2FA verification failed' });
  }
};

export const getAuthStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password -twoFASecret');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, twoFAEnabled: user.twoFAEnabled } });
  } catch (err) {
    logger.error('Auth status error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Failed to get auth status' });
  }
};

export const enable2FA = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!isValidObjectId(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.twoFAEnabled) return res.status(400).json({ success: false, message: '2FA already enabled' });

    const secret = generate2FASecret(user.email);
    logger.info('2FA secret generated', { userId });

    return res.status(200).json({ success: true, secret: secret.base32, otpauthUrl: secret.otpauth_url });
  } catch (err) {
    logger.error('Enable 2FA error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Failed to enable 2FA' });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { userId, token, secret } = req.body;
    if (!isValidObjectId(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });
    if (!token || typeof token !== 'string') return res.status(400).json({ success: false, message: 'Invalid token' });

    const user = await UserModel.findById(userId).select('+twoFASecret');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isValid = verify2FAToken(secret || user.twoFASecret, token);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid 2FA token' });

    if (!user.twoFAEnabled) {
      user.twoFASecret = secret || user.twoFASecret;
      user.twoFAEnabled = true;
      await user.save();
    }

    return res.status(200).json({ success: true, message: '2FA verified successfully', twoFAEnabled: user.twoFAEnabled });
  } catch (err) {
    logger.error('Verify 2FA error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Failed to verify 2FA' });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!isValidObjectId(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const user = await UserModel.findById(userId).select('+password +twoFASecret');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!await user.comparePassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    user.twoFAEnabled = false;
    user.twoFASecret = undefined;
    await user.save();

    logger.info('2FA disabled', { userId });
    return res.json({ success: true, message: '2FA disabled successfully' });
  } catch (err) {
    logger.error('Disable 2FA error', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Failed to disable 2FA' });
  }
};

export default {
  register, login, verify2FALogin, getAuthStatus, enable2FA, verify2FA, disable2FA
};
