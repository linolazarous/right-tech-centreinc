const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateStudyGroup } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/study-groups',
  authMiddleware,
  validateStudyGroup,
  rateLimit('10req/day'),
  socialController.createStudyGroup
);

router.get(
  '/study-groups',
  authMiddleware,
  rateLimit('50req/hour'),
  socialController.getStudyGroups
);

module.exports = router;
