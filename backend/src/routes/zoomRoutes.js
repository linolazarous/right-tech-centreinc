import express from 'express';
const router = express.Router();
import zoomController from '../controllers/zoomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateZoomMeeting } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/schedule-meeting',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateZoomMeeting,
  rateLimit('10req/day'),
  zoomController.scheduleMeeting
);

export default router;
