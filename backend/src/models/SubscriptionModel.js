const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    plan: {
      type: String,
      required: [true, 'Plan type is required'],
      enum: {
        values: ['basic', 'premium', 'enterprise', 'trial'],
        message: 'Invalid subscription plan'
      },
      default: 'basic'
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ['monthly', 'annual'],
      default: 'monthly'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
      validate: {
        validator: function(v) {
          return v <= new Date();
        },
        message: 'Start date cannot be in the future'
      }
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'cancelled', 'pending', 'expired'],
      default: 'active'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'digitalocean_balance', 'bank_transfer'],
      required: function() {
        return this.status === 'active' && this.plan !== 'trial';
      }
    },
    lastPayment: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
        uppercase: true,
        enum: ['USD', 'EUR', 'GBP']
      },
      date: Date,
      transactionId: String
    },
    nextBillingDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v > new Date();
        },
        message: 'Next billing date must be in the future'
      }
    },
    cancellation: {
      requestedAt: Date,
      reason: String,
      effectiveDate: Date
    },
    metadata: {
      digitalOceanInvoiceId: String,
      couponCode: String,
      discountApplied: Number
    }
  },
  {
    // DigitalOcean Optimized Settings
    timestamps: true,
    strict: 'throw',
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.metadata; // Sensitive data
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
subscriptionSchema.index({ userId: 1, status: 1 }); // User subscriptions lookup
subscriptionSchema.index({ endDate: 1 }); // For expiring subscriptions
subscriptionSchema.index({ status: 1, nextBillingDate: 1 }); // For billing jobs
subscriptionSchema.index({ 'metadata.digitalOceanInvoiceId': 1 }); // For payment reconciliation

// Virtuals
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && (!this.endDate || this.endDate > new Date());
});

subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  return Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Query Helpers
subscriptionSchema.query.active = function() {
  return this.where({ 
    status: 'active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gt: new Date() } }
    ]
  });
};

subscriptionSchema.query.expiringSoon = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return this.where({ 
    status: 'active',
    endDate: { $lte: date }
  });
};

// DigitalOcean Monitoring Hooks
subscriptionSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Subscription updated - User: ${doc.userId}, Status: ${doc.status}`);
});

// Auto-set endDate for non-recurring plans
subscriptionSchema.pre('save', function(next) {
  if (this.plan === 'trial' && !this.endDate) {
    const trialEnd = new Date(this.startDate);
    trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
    this.endDate = trialEnd;
  }
  next();
});

// Status validation
subscriptionSchema.pre('save', function(next) {
  if (this.status === 'cancelled' && !this.cancellation.requestedAt) {
    this.cancellation.requestedAt = new Date();
  }
  
  if (this.status === 'active' && this.endDate && this.endDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

// Prevent duplicate active subscriptions
subscriptionSchema.pre('save', async function(next) {
  if (this.status === 'active') {
    const existing = await this.constructor.findOne({
      userId: this.userId,
      status: 'active',
      _id: { $ne: this._id }
    });
    
    if (existing) {
      throw new Error('User already has an active subscription');
    }
  }
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
