const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  eligibilityCriteria: { type: String },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);