const mongoose = require('mongoose');
const validator = require('validator');

const badgeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Badge name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Badge name cannot exceed 50 characters'],
    index: true
  },
  description: { 
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  imageUrl: { 
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid image URL'
    }
  },
  iconUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid icon URL'
    }
  },
  criteria: { 
    type: String,
    required: [true, 'Criteria is required'],
    trim: true,
    maxlength: [500, 'Criteria cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['achievement', 'skill', 'participation', 'milestone', 'special'],
    default: 'achievement'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  xpValue: {
    type: Number,
    min: [0, 'XP value cannot be negative'],
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(v) {
        // Only validate if expiresAt is set
        if (!v) return true;
        return v > this.createdAt;
      },
      message: 'Expiration date must be after creation date'
    }
  }
}, {
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
badgeSchema.index({ category: 1 });
badgeSchema.index({ difficulty: 1 });
badgeSchema.index({ xpValue: 1 });
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ isSecret: 1 });
badgeSchema.index({ tags: 1 });
badgeSchema.index({ createdAt: -1 });

// Pre-save hook to update the updatedAt field
badgeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property for badge status
badgeSchema.virtual('status').get(function() {
  if (!this.isActive) return 'Inactive';
  if (this.expiresAt && this.expiresAt < new Date()) return 'Expired';
  return 'Active';
});

// Static method to get active badges
badgeSchema.statics.getActiveBadges = function() {
  return this.find({ 
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to get badges by category
badgeSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true 
  });
};

// Static method to search badges
badgeSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  });
};

module.exports = mongoose.model('Badge', badgeSchema);
