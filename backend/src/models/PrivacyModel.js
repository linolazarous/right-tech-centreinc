const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showEmail: { type: Boolean, default: false },
  showProfile: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Privacy', privacySchema);