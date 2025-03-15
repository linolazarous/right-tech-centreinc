const mongoose = require('mongoose');

const contentCreationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  contentType: { type: String, enum: ['blog', 'video', 'podcast'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ContentCreation', contentCreationSchema);