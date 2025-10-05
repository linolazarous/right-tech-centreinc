import express from 'express';
import {
  login,
  register,
  getAuthStatus,
  verify2FALogin,
  enable2FA,
  verify2FA,
  disable2FA
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/login/verify-2fa
 * @desc    Verify login with 2FA code
 * @access  Public
 */
router.post('/login/verify-2fa', verify2FALogin);

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable 2FA for user
 * @access  Authenticated
 */
router.post('/2fa/enable', authenticateToken, enable2FA);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify 2FA code
 * @access  Authenticated
 */
router.post('/2fa/verify', authenticateToken, verify2FA);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA for user
 * @access  Authenticated
 */
router.post('/2fa/disable', authenticateToken, disable2FA);

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Authenticated
 */
router.get('/status', authenticateToken, getAuthStatus);

/**
 * @route   GET /api/auth/me
 * @desc    Fetch authenticated user profile
 * @access  Authenticated
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const UserModel = (await import('../models/UserModel.js')).default;
    const user = await UserModel.findById(req.user.id).select('-password -twoFASecret');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
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
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
});

export default router;
