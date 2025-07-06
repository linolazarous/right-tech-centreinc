const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { 
  validateUserRegistration, 
  validateLogin,
  validateRequest 
} = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

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

module.exports = router;
