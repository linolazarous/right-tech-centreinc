import express from 'express';
const router = express.Router();
import corporateTrainingController from '../controllers/corporateTrainingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCorporateTraining } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/corporate-training',
  authMiddleware,
  roleMiddleware(['admin', 'corporate']),
  validateCorporateTraining,
  rateLimit('20req/day'),
  corporateTrainingController.createTraining
);

export default router;
