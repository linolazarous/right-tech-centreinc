import mongoose from 'mongoose';

const supportedLanguages = ['en', 'fr', 'es', 'de', 'pt'];

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
      message: props => `${props.value} is not a valid translation key!`
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
    required: false
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

localizationSchema.index({ key: 1, namespace: 1 }, { unique: true });
localizationSchema.index({ namespace: 1 });

localizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

localizationSchema.statics.findByKey = async function(key, namespace = 'common') {
  try {
    return await this.findOne({ key, namespace });
  } catch (error) {
    console.error(`Error finding localization for key ${key}:`, error);
    throw error;
  }
};

localizationSchema.methods.getTranslation = function(lang = 'en') {
  return this.translations[lang] || this.translations.en || '';
};

localizationSchema.virtual('availableLanguages').get(function() {
  return Object.keys(this.translations).filter(lang => this.translations[lang]);
});

export default mongoose.model('Localization', localizationSchema);
