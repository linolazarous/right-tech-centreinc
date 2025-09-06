import express from 'express';
const router = express.Router();
import proctoringController from '../controllers/proctoringController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateProctoring } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/monitor-exam',
  authMiddleware,
  validateProctoring,
  rateLimit('10req/hour'),
  proctoringController.monitorExam
);

export default router;
