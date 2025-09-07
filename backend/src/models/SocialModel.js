import mongoose from 'mongoose';
import validator from 'validator';

const socialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: {
        values: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'github', 'tiktok'],
        message: '{VALUE} is not a supported platform'
      },
      lowercase: true,
      trim: true
    },
    profileUrl: {
      type: String,
      required: [true, 'Profile URL is required'],
      validate: {
        validator: function(v) {
          const urlPatterns = {
            facebook: /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/([a-zA-Z0-9._-]+)\/?/,
            twitter: /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,15})\/?/,
            linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?/,
            instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)\/?/,
            youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(@|channel\/|[a-zA-Z0-9._-]+)\/?/,
            github: /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?/,
            tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)\/?/
          };
          return urlPatterns[this.platform].test(v);
        },
        message: 'Invalid URL format for {VALUE} platform'
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || (this.isVerified && v <= new Date());
        },
        message: 'Verification date must be present when verified and cannot be in the future'
      }
    },
    metrics: {
      followers: {
        type: Number,
        min: [0, 'Followers count cannot be negative'],
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    privacy: {
      visibleOnProfile: {
        type: Boolean,
        default: true
      },
      showFollowers: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true,
    strict: 'throw',
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (!ret.isVerified) {
          delete ret.verificationDate;
        }
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

socialSchema.index({ userId: 1, platform: 1 }, { unique: true });
socialSchema.index({ platform: 1, 'metrics.followers': -1 });
socialSchema.index({ 'metrics.lastUpdated': -1 });

socialSchema.virtual('iconUrl').get(function() {
  return `${process.env.DO_SPACES_CDN_URL}/social-icons/${this.platform}.svg`;
});

socialSchema.query.byUser = function(userId) {
  return this.where({ userId }).lean();
};

socialSchema.query.byPlatform = function(platform) {
  return this.where({ platform: platform.toLowerCase() });
};

socialSchema.query.verifiedOnly = function() {
  return this.where({ isVerified: true });
};

socialSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Social profile updated - User: ${doc.userId}, Platform: ${doc.platform}`);
});

socialSchema.pre('save', function(next) {
  if (this.isModified('metrics.followers')) {
    this.metrics.lastUpdated = new Date();
  }
  next();
});

socialSchema.pre('save', async function(next) {
  const maxAccounts = process.env.SOCIAL_MAX_ACCOUNTS || 5;
  const count = await this.constructor.countDocuments({ userId: this.userId });
  
  if (count >= maxAccounts) {
    throw new Error(`Maximum ${maxAccounts} social profiles allowed per user`);
  }
  next();
});

export default mongoose.model('Social', socialSchema);
