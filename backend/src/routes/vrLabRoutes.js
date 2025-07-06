const express = require('express');
const router = express.Router();
const vrLabController = require('../controllers/vrLabController');
const { validateVRLabQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/labs',
  validateVRLabQuery,
  rateLimit('1000req/hour'),
  vrLabController.getVRLabs
);

module.exports = router;
