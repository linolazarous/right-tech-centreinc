const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateScholarship } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/scholarships/allocate',
  authMiddleware,
  roleMiddleware(['admin', 'financial_aid']),
  validateScholarship,
  rateLimit('20req/day'),
  scholarshipController.allocateScholarship
);

module.exports = router;
