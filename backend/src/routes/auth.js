import express from 'express';
import { 
  login, 
  getAuthStatus, 
  verify2FALogin,
  enable2FA, 
  verify2FA, 
  disable2FA 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/login/verify-2fa', verify2FALogin);
router.post('/2fa/enable', enable2FA);
router.post('/2fa/verify', verify2FA);

// Protected routes
router.get('/status', authenticateToken, getAuthStatus);
router.post('/2fa/disable', authenticateToken, disable2FA);

export default router;
