const express = require('express');
const router = express.Router();
const corporateTrainingController = require('../controllers/corporateTrainingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCorporateTraining } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/corporate-training',
  authMiddleware,
  roleMiddleware(['admin', 'corporate']),
  validateCorporateTraining,
  rateLimit('20req/day'),
  corporateTrainingController.createTraining
);

module.exports = router;
