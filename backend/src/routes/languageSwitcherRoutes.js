const express = require('express');
const router = express.Router();
const { translate } = require('../controllers/languageSwitcherController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTranslation } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

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

module.exports = router;
