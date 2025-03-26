const mongoose = require('mongoose');
const validator = require('validator'); // For additional validation

const accessibilitySettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: 'Invalid user ID format'
    }
  },
  highContrastMode: { 
    type: Boolean, 
    default: false 
  },
  fontSize: { 
    type: String, 
    enum: {
      values: ['small', 'medium', 'large'],
      message: 'Font size must be either small, medium, or large'
    },
    default: 'medium',
    trim: true
  },
  screenReaderEnabled: { 
    type: Boolean, 
    default: false 
  },
  colorTheme: {  // Added new field as example
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system',
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true // Prevents modification after creation
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: false, // We're handling timestamps manually
  versionKey: false, // Disable the __v field
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id; // Remove _id from output
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      return ret;
    }
  }
});

// Update timestamp and validate before save
accessibilitySettingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Additional validation logic if needed
  if (this.isModified('userId')) {
    if (!mongoose.Types.ObjectId.isValid(this.userId)) {
      return next(new Error('Invalid user reference'));
    }
  }
  
  next();
});

// Add index for better query performance
accessibilitySettingSchema.index({ userId: 1 }, { unique: true });

// Static methods for common queries
accessibilitySettingSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

// Instance methods
accessibilitySettingSchema.methods.toResponse = function() {
  return {
    id: this._id,
    userId: this.userId,
    highContrastMode: this.highContrastMode,
    fontSize: this.fontSize,
    screenReaderEnabled: this.screenReaderEnabled,
    colorTheme: this.colorTheme,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('AccessibilitySetting', accessibilitySettingSchema);
