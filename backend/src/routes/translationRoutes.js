import express from 'express';
const router = express.Router();
import translationController from '../controllers/translationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateTranslation } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/translate',
  authMiddleware,
  validateTranslation,
  rateLimit('100req/hour'),
  translationController.translateText
);

export default router;
