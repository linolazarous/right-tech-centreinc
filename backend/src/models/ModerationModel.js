const mongoose = require('mongoose');

const moderationSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contentType: { type: String, enum: ['post', 'comment', 'video'] },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Moderation', moderationSchema);