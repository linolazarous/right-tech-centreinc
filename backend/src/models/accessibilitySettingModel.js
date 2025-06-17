const mongoose = require('mongoose');
const validator = require('validator');

const accessibilitySettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    index: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: 'Invalid user ID format'
    }
  },
  highContrastMode: {
    type: Boolean,
    default: false,
    required: [true, 'High contrast mode setting is required']
  },
  fontSize: {
    type: String,
    enum: {
      values: ['small', 'medium', 'large', 'x-large'],
      message: 'Font size must be small, medium, large, or x-large'
    },
    default: 'medium',
    required: [true, 'Font size setting is required']
  },
  screenReaderEnabled: {
    type: Boolean,
    default: false,
    required: [true, 'Screen reader setting is required']
  },
  colorTheme: {
    type: String,
    enum: ['light', 'dark', 'high-contrast', 'custom'],
    default: 'light',
    required: [true, 'Color theme setting is required']
  },
  keyboardNavigation: {
    type: Boolean,
    default: false,
    required: [true, 'Keyboard navigation setting is required']
  },
  customThemeSettings: {
    primaryColor: {
      type: String,
      default: '#ffffff',
      validate: {
        validator: (v) => validator.isHexColor(v),
        message: 'Primary color must be a valid hex color'
      }
    },
    secondaryColor: {
      type: String,
      default: '#000000',
      validate: {
        validator: (v) => validator.isHexColor(v),
        message: 'Secondary color must be a valid hex color'
      }
    }
  },
  motionReduction: {
    type: Boolean,
    default: false,
    required: [true, 'Motion reduction setting is required']
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
  timestamps: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  },
  collation: { locale: 'en', strength: 2 } // Case-insensitive indexing
});

// Middleware for updating timestamps
accessibilitySettingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

accessibilitySettingSchema.pre('updateOne', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Static methods
accessibilitySettingSchema.statics = {
  async findByUserId(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }
      return await this.findOne({ userId }).lean();
    } catch (error) {
      throw new Error(`Error finding accessibility settings: ${error.message}`);
    }
  },

  async updateSettings(userId, updates) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }
      return await this.findOneAndUpdate(
        { userId },
        updates,
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      throw new Error(`Error updating settings: ${error.message}`);
    }
  }
};

// Indexes
accessibilitySettingSchema.index({ userId: 1 }, { unique: true });
accessibilitySettingSchema.index({ updatedAt: 1 });

// Virtual for formatted response
accessibilitySettingSchema.virtual('formattedSettings').get(function() {
  return {
    highContrastMode: this.highContrastMode,
    fontSize: this.fontSize,
    screenReaderEnabled: this.screenReaderEnabled,
    colorTheme: this.colorTheme,
    keyboardNavigation: this.keyboardNavigation,
    motionReduction: this.motionReduction
  };
});

// Query helper for active settings
accessibilitySettingSchema.query.activeSettings = function() {
  return this.where({ 
    $or: [
      { highContrastMode: true },
      { screenReaderEnabled: true },
      { keyboardNavigation: true }
    ]
  });
};

const AccessibilitySetting = mongoose.model('AccessibilitySetting', accessibilitySettingSchema);

module.exports = AccessibilitySetting;
