const mongoose = require('mongoose');

const languageSwitcherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferredLanguage: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LanguageSwitcher', languageSwitcherSchema);