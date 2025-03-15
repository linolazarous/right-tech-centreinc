const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', adSchema);