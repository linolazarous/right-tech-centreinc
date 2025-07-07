const PaymentModel = require('../models/paymentModel');
const logger = require('../utils/logger');

class PaymentService {
  static async processPayment(paymentData) {
    try {
      if (!paymentData || !paymentData.userId || !paymentData.amount) {
        throw new Error('Invalid payment data');
      }

      const newPayment = new PaymentModel({
        ...paymentData,
        status: 'pending',
        processedAt: new Date()
      });

      await newPayment.validate();
      const savedPayment = await newPayment.save();
      
      logger.info(`Payment processed for user ${paymentData.userId}`);
      return savedPayment;
    } catch (error) {
      logger.error(`Payment processing failed: ${error.message}`);
      throw new Error('Payment processing failed');
    }
  }

  static async getPaymentHistory(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const payments = await PaymentModel.find({ userId })
        .sort({ processedAt: -1 })
        .lean();
      
      return payments;
    } catch (error) {
      logger.error(`Failed to fetch payment history: ${error.message}`);
      throw new Error('Failed to retrieve payment history');
    }
  }
}

module.exports = PaymentService;
