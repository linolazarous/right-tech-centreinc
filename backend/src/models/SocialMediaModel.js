const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['facebook', 'twitter', 'linkedin'] },
  profileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);