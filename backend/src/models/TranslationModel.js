const mongoose = require('mongoose');
const { DO_SPACE_URL } = process.env;

const translationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    sourceText: {
      type: String,
      required: [true, 'Source text is required'],
      trim: true,
      maxlength: [5000, 'Source text cannot exceed 5000 characters']
    },
    sourceLanguage: {
      type: String,
      required: true,
      enum: {
        values: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'ru'],
        message: 'Unsupported source language'
      },
      default: 'en'
    },
    targetLanguage: {
      type: String,
      required: true,
      enum: {
        values: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'ru'],
        message: 'Unsupported target language'
      },
      validate: {
        validator: function(v) {
          return v !== this.sourceLanguage;
        },
        message: 'Target language must differ from source language'
      }
    },
    translatedText: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || v.length <= 10000;
        },
        message: 'Translation cannot exceed 10000 characters'
      }
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'reviewed'],
      default: 'pending'
    },
    translationEngine: {
      type: String,
      enum: ['google', 'deepl', 'azure', 'manual', 'custom'],
      default: 'google'
    },
    metadata: {
      confidenceScore: {
        type: Number,
        min: 0,
        max: 1
      },
      characterCount: {
        type: Number,
        min: 0
      },
      apiResponseTime: Number,
      detectedLanguage: String
    },
    attachments: [{
      name: String,
      url: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || v.startsWith(DO_SPACE_URL);
          },
          message: 'Attachment must be hosted on DigitalOcean Spaces'
        }
      },
      originalName: String
    }],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  {
    // DigitalOcean Optimized Settings
    timestamps: true,
    strict: 'throw',
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
translationSchema.index({ userId: 1, status: 1 }); // User translations lookup
translationSchema.index({ 
  sourceLanguage: 1, 
  targetLanguage: 1 
}); // For language pair analytics
translationSchema.index({ createdAt: -1 }); // Recent translations
translationSchema.index({ 
  sourceText: 'text', 
  translatedText: 'text' 
}); // Full-text search

// Virtuals
translationSchema.virtual('languagePair').get(function() {
  return `${this.sourceLanguage}-${this.targetLanguage}`;
});

// Query Helpers
translationSchema.query.byLanguagePair = function(source, target) {
  return this.where({ 
    sourceLanguage: source, 
    targetLanguage: target 
  });
};

translationSchema.query.byStatus = function(status) {
  return this.where({ status });
};

// DigitalOcean Monitoring Hooks
translationSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Translation ${doc.status} - ID: ${doc._id}, Pair: ${doc.languagePair}`);
});

// Auto-calculate character count
translationSchema.pre('save', function(next) {
  if (this.isModified('sourceText')) {
    this.metadata.characterCount = this.sourceText.length;
  }
  next();
});

// Validate attachment count
translationSchema.pre('save', function(next) {
  if (this.attachments && this.attachments.length > 5) {
    throw new Error('Maximum 5 attachments allowed per translation');
  }
  next();
});

module.exports = mongoose.model('Translation', translationSchema);
