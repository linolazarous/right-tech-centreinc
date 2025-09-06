import express from 'express';
const router = express.Router();
import integrationController from '../controllers/integrationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateGoogleIntegration } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/integrate-google',
  authMiddleware,
  roleMiddleware(['admin', 'teacher']),
  validateGoogleIntegration,
  rateLimit('5req/hour'),
  integrationController.integrateGoogleWorkspace
);

export default router;
