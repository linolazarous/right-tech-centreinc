import mongoose from 'mongoose';
import validator from 'validator';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
    set: v => parseFloat(v.toFixed(2))
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR', 'BTC', 'ETH']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: [
      'credit_card', 'debit_card', 'paypal', 'bank_transfer',
      'crypto', 'apple_pay', 'google_pay', 'stripe', 'digital_wallet'
    ],
    index: true
  },
  paymentMethodDetails: {
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number,
    walletType: String,
    bankName: String,
    cryptoAddress: String,
    cryptoTransactionId: String
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending', 'completed', 'failed', 'refunded',
      'partially_refunded', 'disputed', 'chargeback', 'canceled'
    ],
    default: 'pending',
    index: true
  },
  gateway: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'coinbase', 'braintree', 'adyen', 'other'],
    index: true
  },
  gatewayTransactionId: { type: String, index: true, sparse: true },
  gatewayResponse: mongoose.Schema.Types.Mixed,
  failureReason: { type: String, maxlength: 500 },
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  taxAmount: { type: Number, min: 0, default: 0 },
  shippingAmount: { type: Number, min: 0, default: 0 },
  discountAmount: { type: Number, min: 0, default: 0 },
  totalAmount: {
    type: Number,
    required: true,
    min: 0.01
  },
  invoiceNumber: { type: String, unique: true, sparse: true },
  invoiceUrl: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: v => `${v} is not a valid URL!`
    }
  },
  refunds: [{
    amount: { type: Number, required: true, min: 0.01 },
    reason: { type: String, maxlength: 500 },
    processedAt: { type: Date, default: Date.now },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gatewayRefundId: String
  }],
  metadata: { type: Object, default: {} },
  ipAddress: {
    type: String,
    validate: { validator: validator.isIP, message: v => `${v} is not a valid IP!` }
  },
  deviceInfo: String,
  completedAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

paymentSchema.pre('save', function (next) {
  this.totalAmount = this.amount + this.taxAmount + this.shippingAmount - this.discountAmount;
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt)
    this.completedAt = new Date();
  next();
});

paymentSchema.statics.findByUser = async function (userId, limit = 10) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit).populate('orderId', 'items total');
};

paymentSchema.methods.markAsCompleted = async function (response) {
  this.status = 'completed';
  this.gatewayResponse = response;
  this.completedAt = new Date();
  return this.save();
};

paymentSchema.virtual('formattedAmount').get(function () {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: this.currency }).format(this.amount);
});

export default mongoose.model('Payment', paymentSchema);
