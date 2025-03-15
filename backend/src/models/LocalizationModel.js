const mongoose = require('mongoose');

const localizationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  translations: {
    en: { type: String },
    fr: { type: String },
    es: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Localization', localizationSchema);