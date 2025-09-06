import express from 'express';
const router = express.Router();
import notificationController from '../controllers/pushNotificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateNotification } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/send',
  authMiddleware,
  validateNotification,
  rateLimit('50req/hour'),
  notificationController.sendNotification
);

export default router;
