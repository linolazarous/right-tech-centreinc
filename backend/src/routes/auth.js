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
import { authenticateToken } from '../middleware/auth.js';

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

export default router;
