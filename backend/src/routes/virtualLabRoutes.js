const express = require('express');
const router = express.Router();
const virtualLabController = require('../controllers/virtualLabController');
const { validateLabQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/labs',
  validateLabQuery,
  rateLimit('1000req/hour'),
  virtualLabController.getVirtualLabs
);

module.exports = router;
