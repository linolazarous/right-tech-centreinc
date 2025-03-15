const PaymentModel = require('../models/paymentModel');

class PaymentService {
  static async processPayment(paymentData) {
    const newPayment = new PaymentModel(paymentData);
    return await newPayment.save();
  }

  static async getPaymentHistory(userId) {
    return await PaymentModel.find({ userId });
  }
}

module.exports = PaymentService;