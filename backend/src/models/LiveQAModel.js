const mongoose = require('mongoose');

const liveQASchema = new mongoose.Schema({
  question: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LiveQA', liveQASchema);