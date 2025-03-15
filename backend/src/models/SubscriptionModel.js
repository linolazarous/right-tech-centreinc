const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['basic', 'premium', 'enterprise'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);