import express from 'express';
const router = express.Router();
import AffiliationController from '../controllers/affiliationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateAffiliation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

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

export default router;
