import express from 'express';
import certificateController from '../controllers/certificateController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCertificate } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/certificates/issue
 * @desc    Issue a course completion certificate
 * @access  Admin, Instructor
 */
router.post(
  '/issue',
  authMiddleware,
  roleMiddleware(['admin', 'instructor']),
  validateCertificate,
  rateLimit('100req/day'),
  certificateController.issueCertificate
);

export default router;
