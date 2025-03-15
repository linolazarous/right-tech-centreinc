const mongoose = require('mongoose');

const microlearningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  contentUrl: { type: String, required: true },
  duration: { type: Number }, // Duration in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Microlearning', microlearningSchema);