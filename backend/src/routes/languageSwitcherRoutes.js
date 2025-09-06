import express from 'express';
const router = express.Router();
import { translate } from '../controllers/languageSwitcherController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateTranslation } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/translate',
  authMiddleware,
  validateTranslation,
  rateLimit('100req/hour'),
  translate
);

// Add endpoint to get supported languages
router.get(
  '/supported-languages',
  rateLimit('1000req/hour'),
  (req, res) => res.json({ supportedLanguages: ['en', 'es', 'fr', 'de'] })
);

export default router;
