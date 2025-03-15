const mongoose = require('mongoose');

const offlineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Offline', offlineSchema);