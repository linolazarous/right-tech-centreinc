const express = require('express');
const router = express.Router();
const { getPrivacyPolicy, deleteUserData } = require('../controllers/privacyController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateDataDeletion } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/privacy-policy',
  rateLimit('1000req/hour'),
  getPrivacyPolicy
);

router.delete(
  '/delete-data',
  authMiddleware,
  validateDataDeletion,
  rateLimit('1req/week'),
  deleteUserData
);

module.exports = router;
