const mongoose = require('mongoose');

const jobMatchingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  matchScore: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobMatching', jobMatchingSchema);