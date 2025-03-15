const mongoose = require('mongoose');

const codingChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  codeTemplate: { type: String },
  testCases: [{ input: String, output: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);