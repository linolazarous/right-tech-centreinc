import express from 'express';
const router = express.Router();
import { getPrivacyPolicy, deleteUserData } from '../controllers/privacyController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateDataDeletion } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/privacy-policy',
  rateLimit('1000req/hour'),
  getPrivacyPolicy
);

router.delete(
  '/delete-data',
  authMiddleware,
  validateDataDeletion,
  rateLimit('1req/week'),
  deleteUserData
);

export default router;
