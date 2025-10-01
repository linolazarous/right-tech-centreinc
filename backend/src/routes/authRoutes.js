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

// Public routes - Registration & Login
router.post('/register', register);
router.post('/login', login);
router.post('/login/verify-2fa', verify2FALogin);

// 2FA routes (protected)
router.post('/2fa/enable', authenticateToken, enable2FA);
router.post('/2fa/verify', authenticateToken, verify2FA);
router.post('/2fa/disable', authenticateToken, disable2FA);

// Status check (protected)
router.get('/status', authenticateToken, getAuthStatus);

// Add these missing endpoints that frontend expects:
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const UserModel = (await import('../models/UserModel.js')).default;
    const user = await UserModel.findById(req.user.id).select('-password -twoFASecret');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
});

export default router;
