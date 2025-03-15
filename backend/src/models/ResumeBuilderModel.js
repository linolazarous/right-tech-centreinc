const mongoose = require('mongoose');

const resumeBuilderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ResumeBuilder', resumeBuilderSchema);