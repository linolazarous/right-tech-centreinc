const express = require('express');
const router = express.Router();
const { createCampus } = require('../controllers/metaverseController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateMetaverseCampus } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['admin']),
  validateMetaverseCampus,
  rateLimit('5req/day'),
  createCampus
);

module.exports = router;
