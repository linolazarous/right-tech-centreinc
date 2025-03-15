const mongoose = require('mongoose');

const zoomSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Zoom', zoomSchema);