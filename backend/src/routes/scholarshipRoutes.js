import express from 'express';
const router = express.Router();
import scholarshipController from '../controllers/scholarshipController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateScholarship } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/scholarships/allocate',
  authMiddleware,
  roleMiddleware(['admin', 'financial_aid']),
  validateScholarship,
  rateLimit('20req/day'),
  scholarshipController.allocateScholarship
);

export default router;
