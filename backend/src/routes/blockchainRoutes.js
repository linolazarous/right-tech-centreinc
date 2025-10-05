import express from 'express';
import blockchainController from '../controllers/blockchainController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCertificate } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/blockchain/issue
 * @desc    Issue a blockchain certificate
 * @access  Admin, Registrar
 */
router.post(
  '/issue',
  authMiddleware,
  roleMiddleware(['admin', 'registrar']),
  validateCertificate,
  rateLimit('50req/day'),
  blockchainController.issueCertificate
);

export default router;
