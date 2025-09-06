import express from 'express';
const router = express.Router();
import certificateController from '../controllers/certificateController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCertificate } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/issue-certificate',
  authMiddleware,
  roleMiddleware(['admin', 'instructor']),
  validateCertificate,
  rateLimit('100req/day'),
  certificateController.issueCertificate
);

export default router;
