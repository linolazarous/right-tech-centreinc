const express = require('express');
const router = express.Router();
const AffiliationController = require('../controllers/affiliationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateAffiliation } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

// Get all affiliations
router.get(
  '/affiliations',
  rateLimit('1000req/hour'),
  AffiliationController.getAffiliations
);

// Add a new affiliation
router.post(
  '/affiliations',
  authMiddleware,
  roleMiddleware(['admin']),
  validateAffiliation,
  rateLimit('100req/day'),
  AffiliationController.addAffiliation
);

module.exports = router;
