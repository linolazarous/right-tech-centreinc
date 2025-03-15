const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  steps: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CareerPath', careerPathSchema);