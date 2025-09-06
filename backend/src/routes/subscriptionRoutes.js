import express from 'express';
const router = express.Router();
import { subscribe, getUserSubscriptions } from '../controllers/subscriptionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateSubscription } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/',
  authMiddleware,
  validateSubscription,
  rateLimit('5req/day'),
  subscribe
);

router.get(
  '/:userId',
  authMiddleware,
  rateLimit('50req/hour'),
  getUserSubscriptions
);

export default router;
