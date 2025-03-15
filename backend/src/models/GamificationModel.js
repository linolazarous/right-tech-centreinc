const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gamification', gamificationSchema);