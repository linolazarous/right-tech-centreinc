import express from 'express';
import AuthController from '../controllers/authController.js';
import { 
  validateUserRegistration, 
  validateLogin,
  validateRequest 
} from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// User login with rate limiting
router.post(
  '/login',
  validateLogin,
  validateRequest,
  rateLimit('20req/hour'),
  AuthController.login
);

// User registration with validation middleware
router.post(
  '/register',
  validateUserRegistration,
  validateRequest,
  rateLimit('10req/hour'),
  AuthController.register
);

// 2FA routes
router.post('/enable-2fa', authMiddleware, AuthController.enable2FA);
router.post('/verify-2fa', authMiddleware, AuthController.verify2FA);

export default router;
