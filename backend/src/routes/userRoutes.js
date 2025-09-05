import express from 'express';
import userController from '../controllers/userController.js';
import { 
  validateUserRegistration, 
  validateUserLogin,
  validateRequest 
} from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

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

export default router;
