const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateGoogleIntegration } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/integrate-google',
  authMiddleware,
  roleMiddleware(['admin', 'teacher']),
  validateGoogleIntegration,
  rateLimit('5req/hour'),
  integrationController.integrateGoogleWorkspace
);

module.exports = router;
