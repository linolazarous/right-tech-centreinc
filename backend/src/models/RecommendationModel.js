const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);