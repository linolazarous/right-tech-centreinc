import express from 'express';
const router = express.Router();
import { createCampus } from '../controllers/metaverseController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateMetaverseCampus } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['admin']),
  validateMetaverseCampus,
  rateLimit('5req/day'),
  createCampus
);

export default router;
