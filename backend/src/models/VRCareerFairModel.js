const mongoose = require('mongoose');

const vrCareerFairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fairUrl: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VRCareerFair', vrCareerFairSchema);