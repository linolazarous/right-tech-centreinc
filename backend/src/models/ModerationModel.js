const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const moderationSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Content ID is required'],
    index: true
  },
  contentType: {
    type: String,
    required: [true, 'Content type is required'],
    enum: {
      values: ['post', 'comment', 'video', 'image', 'audio', 'user', 'livestream', 'profile'],
      message: '{VALUE} is not a valid content type'
    },
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'flagged', 'quarantined', 'escalated'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
    index: true
  },
  reason: {
    type: String,
    enum: {
      values: [
        'spam', 'harassment', 'hate_speech', 'explicit_content', 
        'copyright', 'impersonation', 'false_information', 'other'
      ],
      message: '{VALUE} is not a valid reason'
    }
  },
  customReason: {
    type: String,
    maxlength: [500, 'Custom reason cannot exceed 500 characters'],
    trim: true
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.status !== 'pending';
    }
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  originalContent: {
    type: mongoose.Schema.Types.Mixed // For storing content snapshot
  },
  moderationNotes: {
    type: String,
    maxlength: [1000, 'Moderation notes cannot exceed 1000 characters'],
    trim: true
  },
  appealStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  appealDate: {
    type: Date
  },
  appealDecisionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appealNotes: {
    type: String,
    maxlength: [1000, 'Appeal notes cannot exceed 1000 characters'],
    trim: true
  },
  actionTaken: {
    type: String,
    enum: [
      'none', 'content_removed', 'content_edited', 
      'user_warned', 'user_suspended', 'user_banned'
    ],
    default: 'none'
  },
  suspensionDuration: {
    type: Number // In hours, 0 for permanent
  },
  automated: {
    type: Boolean,
    default: false
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    type: Object,
    default: {}
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
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common query patterns
moderationSchema.index({ contentType: 1, status: 1 });
moderationSchema.index({ status: 1, createdAt: 1 });
moderationSchema.index({ reportedBy: 1, createdAt: 1 });
moderationSchema.index({ moderatedBy: 1, resolvedAt: 1 });

// Pre-save hook to update timestamps
moderationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

// Static methods
moderationSchema.statics.findPendingByType = async function(contentType, limit = 50) {
  try {
    return await this.find({ 
      contentType, 
      status: 'pending' 
    })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('reportedBy', 'username email');
  } catch (error) {
    logger.error(`Error finding pending ${contentType} items:`, error);
    throw error;
  }
};

moderationSchema.statics.approveContent = async function(contentId, moderatorId, notes = '') {
  try {
    return await this.findOneAndUpdate(
      { contentId, status: 'pending' },
      { 
        status: 'approved',
        moderatedBy: moderatorId,
        moderationNotes: notes,
        resolvedAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error approving content ${contentId}:`, error);
    throw error;
  }
};

moderationSchema.statics.rejectContent = async function(contentId, moderatorId, reason, notes = '') {
  try {
    return await this.findOneAndUpdate(
      { contentId, status: 'pending' },
      { 
        status: 'rejected',
        reason,
        moderatedBy: moderatorId,
        moderationNotes: notes,
        resolvedAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error rejecting content ${contentId}:`, error);
    throw error;
  }
};

// Instance methods
moderationSchema.methods.escalate = async function(moderatorId, notes) {
  try {
    this.status = 'escalated';
    this.moderatedBy = moderatorId;
    this.moderationNotes = notes;
    return await this.save();
  } catch (error) {
    logger.error(`Error escalating moderation ${this._id}:`, error);
    throw error;
  }
};

moderationSchema.methods.createAppeal = async function(notes) {
  try {
    this.appealStatus = 'pending';
    this.appealDate = new Date();
    this.appealNotes = notes;
    return await this.save();
  } catch (error) {
    logger.error(`Error creating appeal for ${this._id}:`, error);
    throw error;
  }
};

// Virtuals
moderationSchema.virtual('isResolved').get(function() {
  return this.status !== 'pending';
});

moderationSchema.virtual('contentTypeLabel').get(function() {
  const labels = {
    post: 'Post',
    comment: 'Comment',
    video: 'Video',
    image: 'Image',
    audio: 'Audio',
    user: 'User Profile',
    livestream: 'Live Stream',
    profile: 'Profile'
  };
  return labels[this.contentType] || this.contentType;
});

const Moderation = mongoose.model('Moderation', moderationSchema);

module.exports = Moderation;
