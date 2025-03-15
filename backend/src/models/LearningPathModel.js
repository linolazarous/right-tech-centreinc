const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LearningPath', learningPathSchema);