const mongoose = require('mongoose');

const proctoringSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  flaggedEvents: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Proctoring', proctoringSchema);