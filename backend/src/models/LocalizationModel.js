const mongoose = require('mongoose');
const { logger } = require('../utils/logger'); // Assuming you have a logger utility

const supportedLanguages = ['en', 'fr', 'es', 'de', 'pt']; // Extend with more languages as needed

const localizationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Translation key is required'],
    unique: true,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_.-]+$/.test(v);
      },
      message: props => `${props.value} is not a valid translation key! Only alphanumeric, underscore, dot and hyphen characters are allowed.`
    }
  },
  translations: {
    en: { 
      type: String,
      required: [true, 'English translation is required as fallback']
    },
    fr: { type: String },
    es: { type: String },
    de: { type: String },
    pt: { type: String }
  },
  namespace: {
    type: String,
    default: 'common',
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if you have user authentication
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true, // Mongoose will handle createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
localizationSchema.index({ key: 1, namespace: 1 }, { unique: true });
localizationSchema.index({ namespace: 1 });

// Middleware to update the updatedAt field
localizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find by key and namespace
localizationSchema.statics.findByKey = async function(key, namespace = 'common') {
  try {
    return await this.findOne({ key, namespace });
  } catch (error) {
    logger.error(`Error finding localization for key ${key}:`, error);
    throw error;
  }
};

// Instance method to get translation for a specific language
localizationSchema.methods.getTranslation = function(lang = 'en') {
  return this.translations[lang] || this.translations.en || '';
};

// Virtual for all available translations
localizationSchema.virtual('availableLanguages').get(function() {
  return Object.keys(this.translations).filter(lang => this.translations[lang]);
});

const Localization = mongoose.model('Localization', localizationSchema);

module.exports = Localization;
