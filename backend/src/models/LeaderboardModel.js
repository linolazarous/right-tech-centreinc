const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  rank: { type: Number },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);