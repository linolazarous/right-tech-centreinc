const mongoose = require('mongoose');

const arVrLearningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  arVrContentUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ARVRLearning', arVrLearningSchema);