const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);