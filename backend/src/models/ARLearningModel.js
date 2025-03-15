const mongoose = require('mongoose');

const arLearningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  arContentUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ARLearning', arLearningSchema);