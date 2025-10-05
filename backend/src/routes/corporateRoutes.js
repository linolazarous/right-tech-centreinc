import express from 'express';
import corporateTrainingController from '../controllers/corporateTrainingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCorporateTraining } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/corporate/training
 * @desc    Create a new corporate training program
 * @access  Admin, Corporate Partner
 */
router.post(
  '/training',
  authMiddleware,
  roleMiddleware(['admin', 'corporate']),
  validateCorporateTraining,
  rateLimit('20req/day'),
  corporateTrainingController.createTraining
);

export default router;
