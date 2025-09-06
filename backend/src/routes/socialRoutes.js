import express from 'express';
const router = express.Router();
import socialController from '../controllers/socialController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateStudyGroup } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/study-groups',
  authMiddleware,
  validateStudyGroup,
  rateLimit('10req/day'),
  socialController.createStudyGroup
);

router.get(
  '/study-groups',
  authMiddleware,
  rateLimit('50req/hour'),
  socialController.getStudyGroups
);

export default router;
