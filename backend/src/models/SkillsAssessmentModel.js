const mongoose = require('mongoose');

const skillsAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  score: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SkillsAssessment', skillsAssessmentSchema);