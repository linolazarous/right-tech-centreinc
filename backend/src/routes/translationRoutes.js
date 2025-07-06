const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTranslation } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/translate',
  authMiddleware,
  validateTranslation,
  rateLimit('100req/hour'),
  translationController.translateText
);

module.exports = router;
