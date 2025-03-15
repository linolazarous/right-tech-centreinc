const mongoose = require('mongoose');

const virtualTutorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tutorUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VirtualTutor', virtualTutorSchema);