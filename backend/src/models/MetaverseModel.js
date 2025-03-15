const mongoose = require('mongoose');

const metaverseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  virtualWorldUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Metaverse', metaverseSchema);