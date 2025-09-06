import express from 'express';
const router = express.Router();
import { moderate } from '../controllers/moderationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateModeration } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/moderate',
  authMiddleware,
  roleMiddleware(['admin', 'moderator']),
  validateModeration,
  rateLimit('100req/hour'),
  moderate
);

export default router;
