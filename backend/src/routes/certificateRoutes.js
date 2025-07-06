const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCertificate } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/issue-certificate',
  authMiddleware,
  roleMiddleware(['admin', 'instructor']),
  validateCertificate,
  rateLimit('100req/day'),
  certificateController.issueCertificate
);

module.exports = router;
