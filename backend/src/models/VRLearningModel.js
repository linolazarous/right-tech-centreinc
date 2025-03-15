const mongoose = require('mongoose');

const vrLearningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  vrContentUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VRLearning', vrLearningSchema);