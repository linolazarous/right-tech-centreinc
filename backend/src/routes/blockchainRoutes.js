const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCertificate } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/issue-certificate',
  authMiddleware,
  roleMiddleware(['admin', 'registrar']),
  validateCertificate,
  rateLimit('50req/day'),
  blockchainController.issueCertificate
);

module.exports = router;
