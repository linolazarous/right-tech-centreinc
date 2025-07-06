const express = require('express');
const router = express.Router();
const { translate } = require('../controllers/localizationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateLocalization } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/translate',
  authMiddleware,
  validateLocalization,
  rateLimit('100req/hour'),
  translate
);

module.exports = router;
