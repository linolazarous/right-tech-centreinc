import express from 'express';
const router = express.Router();
import { translate } from '../controllers/localizationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateLocalization } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/translate',
  authMiddleware,
  validateLocalization,
  rateLimit('100req/hour'),
  translate
);

export default router;
