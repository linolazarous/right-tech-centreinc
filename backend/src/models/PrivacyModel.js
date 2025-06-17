const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const privacySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    index: true
  },
  // Profile Visibility Settings
  profileVisibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'public',
    required: true
  },
  // Contact Information Visibility
  contactVisibility: {
    email: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'private'
    },
    phone: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'private'
    },
    address: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'private'
    }
  },
  // Content Sharing Preferences
  contentSharing: {
    posts: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    },
    comments: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    },
    media: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    }
  },
  // Data Collection Preferences
  dataCollection: {
    analytics: {
      type: Boolean,
      default: true
    },
    personalizedAds: {
      type: Boolean,
      default: true
    },
    thirdPartySharing: {
      type: Boolean,
      default: false
    },
    locationTracking: {
      type: Boolean,
      default: false
    }
  },
  // Search Engine Visibility
  searchIndexing: {
    type: Boolean,
    default: true
  },
  // Connection Management
  connectionPreferences: {
    whoCanSendRequests: {
      type: String,
      enum: ['anyone', 'connections_of_connections', 'no_one'],
      default: 'anyone'
    },
    whoCanSeeConnections: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'connections'
    },
    connectionApproval: {
      type: Boolean,
      default: true
    }
  },
  // Notification Preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  // GDPR Compliance
  gdprCompliance: {
    dataPortability: {
      type: Boolean,
      default: true
    },
    rightToBeForgotten: {
      type: Boolean,
      default: true
    },
    lastDataExport: Date,
    lastDataDeletion: Date
  },
  // Activity Status
  showOnlineStatus: {
    type: Boolean,
    default: true
  },
  showLastSeen: {
    type: String,
    enum: ['everyone', 'connections', 'nobody'],
    default: 'connections'
  },
  // Metadata and Timestamps
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
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
privacySchema.index({ userId: 1 });
privacySchema.index({ 'profileVisibility': 1 });
privacySchema.index({ 'dataCollection.personalizedAds': 1 });
privacySchema.index({ 'gdprCompliance.rightToBeForgotten': 1 });

// Middleware to update version and timestamps
privacySchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
    this.version += 1;
  }
  next();
});

// Static Methods
privacySchema.statics.findByUserId = async function(userId) {
  try {
    return await this.findOne({ userId })
      .populate('userId', 'username email');
  } catch (error) {
    logger.error(`Error finding privacy settings for user ${userId}:`, error);
    throw error;
  }
};

privacySchema.statics.resetToDefault = async function(userId) {
  try {
    return await this.findOneAndUpdate(
      { userId },
      { $set: new this({ userId }).toObject() },
      { new: true, upsert: true }
    );
  } catch (error) {
    logger.error(`Error resetting privacy settings for user ${userId}:`, error);
    throw error;
  }
};

// Instance Methods
privacySchema.methods.isProfileVisibleTo = function(viewerId, connectionStatus) {
  switch (this.profileVisibility) {
    case 'public':
      return true;
    case 'connections':
      return connectionStatus === 'connected';
    case 'private':
      return viewerId.equals(this.userId);
    default:
      return false;
  }
};

privacySchema.methods.exportData = function() {
  return {
    settings: this.toObject(),
    exportedAt: new Date()
  };
};

// Virtuals
privacySchema.virtual('isStrictPrivacy').get(function() {
  return this.profileVisibility === 'private' && 
         this.contactVisibility.email === 'private' &&
         this.searchIndexing === false;
});

privacySchema.virtual('isShareEverything').get(function() {
  return this.profileVisibility === 'public' && 
         this.contentSharing.posts === 'public' &&
         this.searchIndexing === true;
});

const Privacy = mongoose.model('Privacy', privacySchema);

module.exports = Privacy;
