const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const validator = require('validator');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
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
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be at least 0.01'],
    set: v => parseFloat(v.toFixed(2)) // Ensure 2 decimal places
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true,
    enum: {
      values: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR', 'BTC', 'ETH'],
      message: '{VALUE} is not a supported currency'
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: [
        'credit_card', 
        'debit_card', 
        'paypal', 
        'bank_transfer', 
        'crypto', 
        'apple_pay', 
        'google_pay',
        'stripe',
        'digital_wallet'
      ],
      message: '{VALUE} is not a supported payment method'
    },
    index: true
  },
  paymentMethodDetails: {
    type: {
      last4: String,
      brand: String,
      expMonth: Number,
      expYear: Number,
      walletType: String,
      bankName: String,
      cryptoAddress: String,
      cryptoTransactionId: String
    },
    required: function() {
      return this.status === 'completed';
    }
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: [
        'pending', 
        'completed', 
        'failed', 
        'refunded', 
        'partially_refunded',
        'disputed',
        'chargeback',
        'canceled'
      ],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'pending',
    index: true
  },
  gateway: {
    type: String,
    required: [true, 'Payment gateway is required'],
    enum: ['stripe', 'paypal', 'coinbase', 'braintree', 'adyen', 'other'],
    index: true
  },
  gatewayTransactionId: {
    type: String,
    index: true,
    sparse: true // Not all payments may have this immediately
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Raw response from payment processor
  },
  failureReason: {
    type: String,
    maxlength: [500, 'Failure reason cannot exceed 500 characters']
  },
  billingAddress: {
    type: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  taxAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  shippingAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  discountAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0.01,
    validate: {
      validator: function(v) {
        return v === this.amount + this.taxAmount + this.shippingAmount - this.discountAmount;
      },
      message: 'Total amount must equal amount + tax + shipping - discount'
    }
  },
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  invoiceUrl: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: props => `${props.value} is not a valid URL!`
    }
  },
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    reason: {
      type: String,
      maxlength: [500, 'Refund reason cannot exceed 500 characters']
    },
    processedAt: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gatewayRefundId: String
  }],
  metadata: {
    type: Object,
    default: {}
  },
  ipAddress: {
    type: String,
    validate: {
      validator: validator.isIP,
      message: props => `${props.value} is not a valid IP address!`
    }
  },
  deviceInfo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ amount: 1 });
paymentSchema.index({ gateway: 1, status: 1 });
paymentSchema.index({ 'paymentMethodDetails.last4': 1 }, { sparse: true });
paymentSchema.index({ 'paymentMethodDetails.cryptoTransactionId': 1 }, { sparse: true });

// Pre-save hooks
paymentSchema.pre('save', function(next) {
  // Calculate total amount before saving
  this.totalAmount = this.amount + this.taxAmount + this.shippingAmount - this.discountAmount;
  
  // Set completedAt timestamp if status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Static methods
paymentSchema.statics.findByUser = async function(userId, limit = 10) {
  try {
    return await this.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('orderId', 'items total');
  } catch (error) {
    logger.error(`Error finding payments for user ${userId}:`, error);
    throw error;
  }
};

paymentSchema.statics.findByGatewayId = async function(gateway, transactionId) {
  try {
    return await this.findOne({ 
      gateway, 
      gatewayTransactionId: transactionId 
    });
  } catch (error) {
    logger.error(`Error finding payment by gateway ID ${transactionId}:`, error);
    throw error;
  }
};

paymentSchema.statics.createRefund = async function(paymentId, refundData) {
  try {
    return await this.findByIdAndUpdate(
      paymentId,
      {
        $push: { refunds: refundData },
        $set: { 
          status: refundData.amount === this.amount ? 'refunded' : 'partially_refunded',
          updatedAt: new Date() 
        }
      },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error creating refund for payment ${paymentId}:`, error);
    throw error;
  }
};

// Instance methods
paymentSchema.methods.markAsCompleted = async function(gatewayResponse) {
  try {
    this.status = 'completed';
    this.gatewayResponse = gatewayResponse;
    this.completedAt = new Date();
    return await this.save();
  } catch (error) {
    logger.error(`Error completing payment ${this._id}:`, error);
    throw error;
  }
};

paymentSchema.methods.addDispute = async function(reason) {
  try {
    this.status = 'disputed';
    this.failureReason = reason;
    return await this.save();
  } catch (error) {
    logger.error(`Error adding dispute to payment ${this._id}:`, error);
    throw error;
  }
};

// Virtuals
paymentSchema.virtual('isRefundable').get(function() {
  return this.status === 'completed' && 
         !['refunded', 'partially_refunded', 'disputed', 'chargeback'].includes(this.status);
});

paymentSchema.virtual('refundedAmount').get(function() {
  return this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
});

paymentSchema.virtual('formattedAmount').get(function() {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: this.currency
  });
  return formatter.format(this.amount);
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
