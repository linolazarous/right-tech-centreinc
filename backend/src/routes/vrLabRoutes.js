import express from 'express';
const router = express.Router();
import vrLabController from '../controllers/vrLabController.js';
import { validateVRLabQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/labs',
  validateVRLabQuery,
  rateLimit('1000req/hour'),
  vrLabController.getVRLabs
);

export default router;
