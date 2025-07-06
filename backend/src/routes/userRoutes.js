const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
  validateUserRegistration, 
  validateUserLogin,
  validateRequest 
} = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/register',
  validateUserRegistration,
  validateRequest,
  rateLimit('10req/hour'),
  userController.register
);

router.post(
  '/login',
  validateUserLogin,
  validateRequest,
  rateLimit('20req/hour'),
  userController.login
);

module.exports = router;
