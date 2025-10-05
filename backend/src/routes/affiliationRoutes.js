import express from 'express';
import AffiliationController from '../controllers/affiliationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateAffiliation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/affiliations
 * @desc    Retrieve all affiliations
 * @access  Public (Rate limited)
 */
router.get(
  '/',
  rateLimit('1000req/hour'),
  AffiliationController.getAffiliations
);

/**
 * @route   POST /api/affiliations
 * @desc    Add a new affiliation
 * @access  Admin only
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateAffiliation,
  rateLimit('100req/day'),
  AffiliationController.addAffiliation
);

export default router;
