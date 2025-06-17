const mongoose = require('mongoose');
const validator = require('validator');

const socialMediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Critical for DigitalOcean query performance
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: {
        values: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'github', 'tiktok', 'pinterest'],
        message: 'Invalid social media platform'
      },
      lowercase: true, // Ensure consistent casing
      trim: true
    },
    profileUrl: {
      type: String,
      required: [true, 'Profile URL is required'],
      validate: {
        validator: function(v) {
          // Platform-specific URL validation
          const urlPatterns = {
            facebook: /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/([a-zA-Z0-9._-]+)\/?/,
            twitter: /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,15})\/?/,
            linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?/,
            instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)\/?/,
            youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(@|[a-zA-Z0-9._-]+)\/?/,
            github: /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?/,
            tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)\/?/,
            pinterest: /(?:https?:\/\/)?(?:www\.)?pinterest\.com\/([a-zA-Z0-9._-]+)\/?/
          };
          return urlPatterns[this.platform].test(v);
        },
        message: 'Invalid URL format for the specified platform'
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationData: {
      verificationDate: Date,
      method: {
        type: String,
        enum: ['manual', 'api', 'oauth']
      }
    },
    metrics: {
      followers: {
        type: Number,
        min: 0,
        default: 0
      },
      lastUpdated: Date
    },
    privacySettings: {
      showOnProfile: {
        type: Boolean,
        default: true
      },
      showFollowersCount: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    // DigitalOcean Optimized Settings
    timestamps: true, // createdAt and updatedAt
    strict: true, // Reject undefined fields
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Hide sensitive verification data
        if (!ret.isVerified) {
          delete ret.verificationData;
        }
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
socialMediaSchema.index({ userId: 1, platform: 1 }, { unique: true }); // Prevent duplicates
socialMediaSchema.index({ platform: 1, 'metrics.followers': -1 }); // For leaderboards
socialMediaSchema.index({ 'metrics.lastUpdated': -1 }); // For stale data checks

// Virtual for platform icon URL (DigitalOcean Spaces)
socialMediaSchema.virtual('platformIcon').get(function() {
  return `${process.env.DO_SPACE_URL}/social-icons/${this.platform}.svg`;
});

// Query Helpers for DigitalOcean Efficiency
socialMediaSchema.query.byPlatform = function(platform) {
  return this.where({ platform: platform.toLowerCase() });
};

socialMediaSchema.query.verifiedOnly = function() {
  return this.where({ isVerified: true });
};

// DigitalOcean Monitoring Hooks
socialMediaSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Social media added - User: ${doc.userId}, Platform: ${doc.platform}`);
});

// Auto-update lastUpdated when followers change
socialMediaSchema.pre('save', function(next) {
  if (this.isModified('metrics.followers')) {
    this.metrics.lastUpdated = new Date();
  }
  next();
});

// Validation for maximum social accounts per user
socialMediaSchema.pre('save', async function(next) {
  const MAX_ACCOUNTS = 5;
  const count = await this.constructor.countDocuments({ userId: this.userId });
  if (count >= MAX_ACCOUNTS) {
    throw new Error(`Maximum ${MAX_ACCOUNTS} social media accounts allowed per user`);
  }
  next();
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
