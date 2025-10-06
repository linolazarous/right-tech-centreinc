import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'enterprise', 'trial'],
    default: 'basic'
  },
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'pending', 'expired'],
    default: 'active'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'digitalocean_balance', 'bank_transfer']
  },
  lastPayment: {
    amount: Number,
    currency: { type: String, default: 'USD', uppercase: true, enum: ['USD', 'EUR', 'GBP'] },
    date: Date,
    transactionId: String
  },
  nextBillingDate: Date,
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'active' && (!this.endDate || this.endDate > Date.now());
});

subscriptionSchema.virtual('daysRemaining').get(function () {
  return this.endDate ? Math.ceil((this.endDate - Date.now()) / 86400000) : null;
});

subscriptionSchema.pre('save', async function (next) {
  if (this.plan === 'trial' && !this.endDate) {
    this.endDate = new Date(Date.now() + 14 * 86400000);
  }

  if (this.status === 'cancelled' && !this.cancellation.requestedAt)
    this.cancellation.requestedAt = new Date();

  if (this.status === 'active' && this.endDate && this.endDate < new Date())
    this.status = 'expired';

  if (this.status === 'active') {
    const existing = await this.constructor.findOne({
      userId: this.userId,
      status: 'active',
      _id: { $ne: this._id }
    });
    if (existing) throw new Error('User already has an active subscription');
  }

  next();
});

export default mongoose.model('Subscription', subscriptionSchema);
