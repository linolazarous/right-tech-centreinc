const mongoose = require('mongoose');
const validator = require('validator');

const languageSwitcherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true, // One language preference per user
    index: true
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    validate: {
      validator: function(v) {
        // Validate against ISO 639-1 language codes
        return validator.isISO6391(v);
      },
      message: props => `${props.value} is not a valid ISO 639-1 language code`
    },
    uppercase: true
  },
  uiLanguage: {
    type: String,
    default: 'en',
    validate: {
      validator: function(v) {
        return validator.isISO6391(v);
      },
      message: props => `${props.value} is not a valid UI language code`
    },
    uppercase: true
  },
  contentLanguage: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isISO6391(v);
      },
      message: props => `${props.value} is not a valid content language code`
    },
    uppercase: true
  },
  languageHistory: [{
    language: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return validator.isISO6391(v);
        },
        message: props => `${props.value} is not a valid language code`
      },
      uppercase: true
    },
    switchedAt: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      enum: ['manual', 'auto-detected', 'profile', 'geoip', 'system']
    }
  }],
  autoDetectionEnabled: {
    type: Boolean,
    default: true
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
languageSwitcherSchema.index({ preferredLanguage: 1 });
languageSwitcherSchema.index({ updatedAt: -1 });
languageSwitcherSchema.index({ 'languageHistory.language': 1 });

// Virtual for display language (falls back to preferredLanguage)
languageSwitcherSchema.virtual('displayLanguage').get(function() {
  return this.uiLanguage || this.preferredLanguage;
});

// Middleware to update timestamps and maintain history
languageSwitcherSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Track language changes in history
  if (this.isModified('preferredLanguage')) {
    this.languageHistory.push({
      language: this.preferredLanguage,
      source: 'manual'
    });
    
    // Keep only the last 10 changes
    if (this.languageHistory.length > 10) {
      this.languageHistory = this.languageHistory.slice(-10);
    }
  }

  // Ensure contentLanguage falls back to preferredLanguage
  if (!this.contentLanguage) {
    this.contentLanguage = this.preferredLanguage;
  }

  next();
});

// Static method to get most popular languages
languageSwitcherSchema.statics.getPopularLanguages = async function(limit = 5) {
  return this.aggregate([
    { $group: { _id: '$preferredLanguage', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { language: '$_id', count: 1, _id: 0 } }
  ]);
};

// Instance method to detect language from text
languageSwitcherSchema.methods.detectLanguage = async function(text) {
  // This would integrate with a language detection service
  // For production, consider using DigitalOcean's AI/ML services
  // or a specialized NLP API
  return {
    detectedLanguage: 'en',
    confidence: 1.0
  };
};

// Query helper for filtering by language
languageSwitcherSchema.query.byLanguage = function(language) {
  return this.where('preferredLanguage', language.toUpperCase());
};

module.exports = mongoose.model('LanguageSwitcher', languageSwitcherSchema);
