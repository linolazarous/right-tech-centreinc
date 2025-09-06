import express from 'express';
const router = express.Router();
import virtualLabController from '../controllers/virtualLabController.js';
import { validateLabQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/labs',
  validateLabQuery,
  rateLimit('1000req/hour'),
  virtualLabController.getVirtualLabs
);

export default router;
