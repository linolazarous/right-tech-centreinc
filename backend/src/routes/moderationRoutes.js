const express = require('express');
const router = express.Router();
const { moderate } = require('../controllers/moderationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateModeration } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/moderate',
  authMiddleware,
  roleMiddleware(['admin', 'moderator']),
  validateModeration,
  rateLimit('100req/hour'),
  moderate
);

module.exports = router;
