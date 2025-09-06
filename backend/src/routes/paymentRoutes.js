import express from 'express';
const router = express.Router();
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validatePayment } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create-payment-intent',
  authMiddleware,
  validatePayment,
  rateLimit('20req/hour'),
  paymentController.createPaymentIntent
);

export default router;
