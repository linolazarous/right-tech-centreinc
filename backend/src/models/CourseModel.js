const mongoose = require('mongoose');
const validator = require('validator');

const forumSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Forum title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    index: true
  },
  description: { 
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [250, 'Short description cannot exceed 250 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['general', 'qna', 'announcements', 'feedback', 'help', 'showcase'],
    default: 'general',
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator ID is required'],
    index: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isLocked: {
    type: Boolean,
    default: false,
    index: true
  },
  isPrivate: {
    type: Boolean,
    default: false,
    index: true
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid thumbnail URL'
    }
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  threadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  postCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastPostBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rules: [{
    type: String,
    trim: true,
    maxlength: [200, 'Rule cannot exceed 200 characters']
  }],
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
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
forumSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
forumSchema.index({ category: 1, isFeatured: 1 });
forumSchema.index({ createdBy: 1, createdAt: -1 });
forumSchema.index({ lastActivity: -1 });
forumSchema.index({ viewCount: -1 });
forumSchema.index({ isPrivate: 1, allowedUsers: 1 });

// Pre-save hook to update timestamps
forumSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual properties
forumSchema.virtual('activityLevel').get(function() {
  const hoursSinceLastActivity = (Date.now() - this.lastActivity) / (1000 * 60 * 60);
  if (hoursSinceLastActivity < 24) return 'high';
  if (hoursSinceLastActivity < 168) return 'medium';
  return 'low';
});

// Static methods
forumSchema.statics.getPublicForums = function(limit = 10) {
  return this.find({ isPrivate: false })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .populate('createdBy', 'name avatar');
};

forumSchema.statics.getFeaturedForums = function() {
  return this.find({ isFeatured: true, isPrivate: false })
    .sort({ viewCount: -1 })
    .populate('createdBy', 'name');
};

forumSchema.statics.incrementViewCount = function(forumId) {
  return this.findByIdAndUpdate(
    forumId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

forumSchema.statics.updateLastActivity = function(forumId, userId) {
  return this.findByIdAndUpdate(
    forumId,
    { 
      lastActivity: new Date(),
      lastPostBy: userId,
      $inc: { postCount: 1 }
    },
    { new: true }
  );
};

// Instance methods
forumSchema.methods.addModerator = function(userId) {
  if (!this.moderators.includes(userId)) {
    this.moderators.push(userId);
  }
  return this.save();
};

forumSchema.methods.toggleLock = function() {
  this.isLocked = !this.isLocked;
  return this.save();
};

forumSchema.methods.addAllowedUser = function(userId) {
  if (!this.allowedUsers.includes(userId)) {
    this.allowedUsers.push(userId);
  }
  return this.save();
};

module.exports = mongoose.model('Forum', forumSchema);
