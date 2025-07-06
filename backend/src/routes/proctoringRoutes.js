const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoringController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateProctoring } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/monitor-exam',
  authMiddleware,
  validateProctoring,
  rateLimit('10req/hour'),
  proctoringController.monitorExam
);

module.exports = router;
