const mongoose = require('mongoose');

const corporateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Corporate', corporateSchema);