const mongoose = require('mongoose');

const pushNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PushNotification', pushNotificationSchema);