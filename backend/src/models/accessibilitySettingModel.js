const mongoose = require('mongoose');

const accessibilitySettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  highContrastMode: { type: Boolean, default: false },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  screenReaderEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the `updatedAt` field before saving
accessibilitySettingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AccessibilitySetting', accessibilitySettingSchema);