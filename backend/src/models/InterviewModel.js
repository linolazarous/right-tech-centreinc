const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewDate: { type: Date, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Interview', interviewSchema);