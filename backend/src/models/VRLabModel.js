const mongoose = require('mongoose');

const vrLabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  labUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VRLab', vrLabSchema);