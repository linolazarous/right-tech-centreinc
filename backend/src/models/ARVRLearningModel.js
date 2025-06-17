const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const arVRLearningSchema = new mongoose.Schema({
  // Core Content Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    minlength: [5, 'Title must be at least 5 characters'],
    index: 'text'
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    index: 'text'
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },

  // Content Type and Media
  contentType: {
    type: String,
    required: true,
    enum: ['ar', 'vr', 'mixed-reality', '360-video'],
    default: 'ar',
    index: true
  },
  contentUrl: {
    type: String,
    required: [true, 'Content URL is required'],
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  previewVideoUrl: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },

  // Technical Specifications
  fileSize: {
    type: Number, // in bytes
    min: [0, 'File size cannot be negative'],
    required: true
  },
  duration: {
    type: Number, // in seconds
    min: [0, 'Duration cannot be negative']
  },
  framework: {
    type: String,
    enum: [
      'unity', 'unreal', 'webxr', 
      'arkit', 'arcore', 'openxr',
      'oculus-sdk', 'steamvr', 'windows-mixed-reality'
    ],
    required: true
  },
  fileFormat: {
    type: String,
    enum: [
      'usdz', 'gltf', 'glb', 'fbx', 
      'obj', 'reality', 'mp4', 'exe'
    ],
    required: true
  },
  requiredHardware: {
    type: [String],
    enum: [
      'smartphone', 'headset', 'controllers',
      'hand-tracking', 'eye-tracking', 'haptic-feedback'
    ],
    default: ['smartphone']
  },

  // Platform Compatibility
  supportedPlatforms: {
    type: [String],
    enum: [
      'ios', 'android', 'windows', 'macos',
      'oculus-quest', 'oculus-rift', 'htc-vive',
      'hololens', 'magicleap', 'playstation-vr'
    ],
    required: true
  },
  minOsVersion: String,
  requiredPermissions: [String], // e.g., camera, location, storage

  // Content Classification
  categories: {
    type: [String],
    enum: [
      'education', 'healthcare', 'engineering',
      'art-design', 'history', 'science',
      'mathematics', 'language', 'business',
      'architecture', 'entertainment'
    ],
    default: ['education'],
    index: true
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  targetAgeGroup: {
    min: { type: Number, min: 5, max: 100 },
    max: { type: Number, min: 5, max: 100 }
  },
  language: {
    type: String,
    default: 'en'
  },

  // Ownership & Publishing
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: Date,
  version: {
    type: String,
    default: '1.0.0'
  },

  // Engagement Metrics
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  interactions: {
    type: Number,
    default: 0,
    min: 0
  },
  avgSessionDuration: {
    type: Number, // in seconds
    default: 0,
    min: 0
  },
  ratings: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Technical Metadata
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true },
  collation: { locale: 'en', strength: 2 } // Case-insensitive
});

// ==============================================
// Indexes for Performance
// ==============================================
arVRLearningSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
arVRLearningSchema.index({ contentType: 1, isPublished: 1 });
arVRLearningSchema.index({ creator: 1, isPublished: 1 });
arVRLearningSchema.index({ framework: 1, fileFormat: 1 });
arVRLearningSchema.index({ views: -1 });
arVRLearningSchema.index({ 'ratings.rating': -1 });

// ==============================================
// Virtual Properties
// ==============================================
arVRLearningSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = this.fileSize;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
});

arVRLearningSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / this.ratings.length;
});

arVRLearningSchema.virtual('ratingCount').get(function() {
  return this.ratings?.length || 0;
});

// ==============================================
// Middleware
// ==============================================
arVRLearningSchema.pre('save', function(next) {
  // Generate slug from title
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  // Set publishedAt date when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Handle DigitalOcean Spaces URLs
  if (process.env.STORAGE_PROVIDER === 'digitalocean') {
    const transformUrl = (field, prefix) => {
      if (this[field] && !this[field].startsWith('http')) {
        this[field] = `${process.env.DO_SPACES_URL}/${prefix}/${this[field]}`;
      }
    };

    transformUrl('contentUrl', 'xr-content');
    transformUrl('thumbnailUrl', 'xr-thumbnails');
    transformUrl('previewVideoUrl', 'xr-previews');
  }

  next();
});

// ==============================================
// Static Methods
// ==============================================
arVRLearningSchema.statics = {
  async getPublishedContent(filter = {}, options = {}) {
    const defaultOptions = {
      sort: '-createdAt',
      limit: 10,
      skip: 0,
      populate: ['creator', 'organization']
    };
    const mergedOptions = { ...defaultOptions, ...options };
    
    return this.find({ ...filter, isPublished: true })
      .sort(mergedOptions.sort)
      .limit(mergedOptions.limit)
      .skip(mergedOptions.skip)
      .populate(mergedOptions.populate);
  },

  async getByContentType(type, options = {}) {
    return this.getPublishedContent({ contentType: type }, options);
  },

  async getTopRatedContent(limit = 5, minRatings = 3) {
    return this.aggregate([
      { $match: { isPublished: true } },
      { $addFields: {
        avgRating: { $avg: '$ratings.rating' },
        ratingCount: { $size: '$ratings' }
      }},
      { $match: { ratingCount: { $gte: minRatings } } },
      { $sort: { avgRating: -1, ratingCount: -1 } },
      { $limit: limit },
      { $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator'
      }},
      { $unwind: '$creator' },
      { $project: {
        title: 1,
        slug: 1,
        contentType: 1,
        thumbnailUrl: 1,
        shortDescription: 1,
        avgRating: 1,
        ratingCount: 1,
        views: 1,
        'creator.name': 1,
        'creator.avatar': 1
      }}
    ]);
  },

  async getPlatformStats() {
    return this.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$supportedPlatforms' },
      { $group: {
        _id: '$supportedPlatforms',
        count: { $sum: 1 },
        avgRating: { $avg: '$ratings.rating' }
      }},
      { $sort: { count: -1 } }
    ]);
  },

  async getContentStats() {
    return this.aggregate([
      { $match: { isPublished: true } },
      { $facet: {
        totalCount: [{ $count: 'count' }],
        byType: [
          { $group: { 
            _id: '$contentType', 
            count: { $sum: 1 } 
          }},
          { $sort: { count: -1 } }
        ],
        byCategory: [
          { $unwind: '$categories' },
          { $group: { 
            _id: '$categories', 
            count: { $sum: 1 } 
          }},
          { $sort: { count: -1 } }
        ],
        popularContent: [
          { $sort: { views: -1 } },
          { $limit: 5 },
          { $project: {
            title: 1,
            slug: 1,
            contentType: 1,
            views: 1
          }}
        ]
      }}
    ]);
  }
};

// ==============================================
// Instance Methods
// ==============================================
arVRLearningSchema.methods = {
  trackView() {
    this.views += 1;
    return this.save();
  },

  trackInteraction(duration = 0) {
    this.interactions += 1;
    if (duration > 0) {
      // Calculate new average session duration
      this.avgSessionDuration = Math.round(
        ((this.avgSessionDuration * (this.interactions - 1)) + duration) / this.interactions
      );
    }
    return this.save();
  },

  addRating(userId, rating, review = '') {
    // Remove existing rating if exists
    this.ratings = this.ratings.filter(r => !r.userId.equals(userId));
    
    // Add new rating
    this.ratings.push({ 
      userId, 
      rating, 
      review,
      createdAt: new Date()
    });
    
    return this.save();
  },

  checkCompatibility(deviceInfo) {
    // Basic compatibility check
    const isPlatformSupported = this.supportedPlatforms.some(
      platform => deviceInfo.platforms.includes(platform)
    );

    const hasRequiredHardware = this.requiredHardware.every(
      hardware => deviceInfo.hardwareCapabilities.includes(hardware)
    );

    return {
      isCompatible: isPlatformSupported && hasRequiredHardware,
      missingPlatforms: isPlatformSupported ? [] : this.supportedPlatforms.filter(
        p => !deviceInfo.platforms.includes(p)
      ),
      missingHardware: hasRequiredHardware ? [] : this.requiredHardware.filter(
        h => !deviceInfo.hardwareCapabilities.includes(h)
      )
    };
  }
};

const ARVRLearning = mongoose.model('ARVRLearning', arVRLearningSchema);

module.exports = ARVRLearning;
