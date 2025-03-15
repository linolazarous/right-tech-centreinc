const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  apiKey: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Integration', integrationSchema);