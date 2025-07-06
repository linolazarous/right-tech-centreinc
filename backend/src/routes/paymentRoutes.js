const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { validatePayment } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create-payment-intent',
  authMiddleware,
  validatePayment,
  rateLimit('20req/hour'),
  paymentController.createPaymentIntent
);

module.exports = router;
