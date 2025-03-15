const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  company: { type: String, required: true },
  location: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);