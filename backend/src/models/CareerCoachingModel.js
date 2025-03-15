const mongoose = require('mongoose');

const careerCoachingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CareerCoaching', careerCoachingSchema);