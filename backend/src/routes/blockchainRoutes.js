import express from 'express';
const router = express.Router();
import blockchainController from '../controllers/blockchainController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCertificate } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/issue-certificate',
  authMiddleware,
  roleMiddleware(['admin', 'registrar']),
  validateCertificate,
  rateLimit('50req/day'),
  blockchainController.issueCertificate
);

export default router;
