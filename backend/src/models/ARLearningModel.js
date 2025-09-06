import mongoose from 'mongoose';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';

const arLearningSchema = new mongoose.Schema({
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

  // Content Delivery
  arContentUrl: {
    type: String,
    required: [true, 'AR content URL is required'],
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  contentId: { // Unique identifier for the AR content bundle
    type: String,
    default: uuidv4
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
    type: Number,
    min: [0, 'File size cannot be negative'],
    required: true
  },
  duration: {
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  markerType: {
    type: String,
    enum: ['image', 'object', 'location', 'face', 'none', 'multi'],
    default: 'image',
    index: true
  },
  markerImageUrl: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  arFramework: {
    type: String,
    enum: ['arkit', 'arcore', 'webxr', '8thwall', 'vuforia', 'unity', 'unreal', 'custom'],
    default: 'arkit'
  },
  fileFormat: {
    type: String,
    enum: ['usdz', 'gltf', 'glb', 'fbx', 'obj', 'reality', 'custom'],
    default: 'usdz'
  },

  // Platform & Compatibility
  targetPlatforms: {
    type: [String],
    enum: ['ios', 'android', 'web', 'hololens', 'magicleap', 'oculus', 'varjo'],
    default: ['ios', 'android'],
    required: true
  },
  minOsVersion: String,
  requiredFeatures: [String], // AR features needed (faceTracking, planeDetection, etc.)
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },

  // Content Classification
  categories: {
    type: [String],
    enum: ['education', 'medicine', 'engineering', 'art', 'history', 'science', 'math', 'language', 'business', 'architecture'],
    default: ['education'],
    index: true
  },
  interactivityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'expert'],
    default: 'medium'
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  ageRange: {
    min: {
      type: Number,
      min: 5,
      max: 100
    },
    max: {
      type: Number,
      min: 5,
      max: 100
    }
  },
  language: {
    type: String,
    default: 'en'
  },

  // Ownership & Publishing
  author: {
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
  avgInteractionTime: {
    type: Number,
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
    review: String
  }],

  // Technical Metadata
  compatibilityData: mongoose.Schema.Types.Mixed,
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
arLearningSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
arLearningSchema.index({ author: 1, isPublished: 1 });
arLearningSchema.index({ categories: 1, isPublished: 1 });
arLearningSchema.index({ interactivityLevel: 1, difficultyLevel: 1 });
arLearningSchema.index({ views: -1 });
arLearningSchema.index({ 'ratings.rating': -1 });

// ==============================================
// Virtual Properties
// ==============================================
arLearningSchema.virtual('formattedFileSize').get(function() {
  const bytes = this.fileSize;
  if (bytes == null) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

arLearningSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / this.ratings.length;
});

arLearningSchema.virtual('contentType').get(function() {
  return `AR/${this.arFramework}/${this.fileFormat}`;
});

// ==============================================
// Middleware
// ==============================================
arLearningSchema.pre('save', function(next) {
  // Generate slug from title
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
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

    transformUrl('arContentUrl', 'ar-content');
    transformUrl('thumbnailUrl', 'ar-thumbnails');
    transformUrl('markerImageUrl', 'ar-markers');
    transformUrl('previewVideoUrl', 'ar-previews');
  }

  next();
});

// ==============================================
// Static Methods
// ==============================================
arLearningSchema.statics = {
  async getPublished(filter = {}, options = {}) {
    const defaultOptions = {
      sort: '-createdAt',
      limit: 10,
      skip: 0
    };
    const mergedOptions = { ...defaultOptions, ...options };
    
    return this.find({ ...filter, isPublished: true })
      .sort(mergedOptions.sort)
      .limit(mergedOptions.limit)
      .skip(mergedOptions.skip)
      .populate('author', 'name avatar')
      .populate('organization', 'name logo');
  },

  async getByFramework(framework, options = {}) {
    return this.getPublished({ arFramework: framework }, options);
  },

  async getTopRated(limit = 5) {
    return this.aggregate([
      { $match: { isPublished: true } },
      { $addFields: {
        avgRating: { $avg: '$ratings.rating' },
        ratingsCount: { $size: '$ratings' }
      }},
      { $match: { ratingsCount: { $gte: 3 } } },
      { $sort: { avgRating: -1, ratingsCount: -1 } },
      { $limit: limit },
      { $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }},
      { $unwind: '$author' },
      { $project: {
        title: 1,
        slug: 1,
        thumbnailUrl: 1,
        shortDescription: 1,
        avgRating: 1,
        ratingsCount: 1,
        views: 1,
        'author.name': 1,
        'author.avatar': 1
      }}
    ]);
  },

  async getContentStats() {
    return this.aggregate([
      { $match: { isPublished: true } },
      { $group: {
        _id: null,
        totalContent: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalInteractions: { $sum: '$interactions' },
        byFramework: { $push: '$arFramework' },
        byCategory: { $push: '$categories' }
      }},
      { $project: {
        _id: 0,
        totalContent: 1,
        totalViews: 1,
        totalInteractions: 1,
        frameworkDistribution: {
          $reduce: {
            input: '$byFramework',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                { [$$this]: { $sum: 1 } }
              ]
            }
          }
        },
        categoryDistribution: {
          $reduce: {
            input: '$byCategory',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                ...$$this.map(cat => ({ [cat]: { $sum: 1 } }))
              ]
            }
          }
        }
      }}
    ]);
  }
};

// ==============================================
// Instance Methods
// ==============================================
arLearningSchema.methods = {
  incrementViews() {
    this.views += 1;
    return this.save();
  },

  incrementInteractions(duration = 0) {
    this.interactions += 1;
    if (duration > 0) {
      // Calculate new average interaction time
      this.avgInteractionTime = Math.round(
        ((this.avgInteractionTime * (this.interactions - 1)) + duration) / this.interactions
      );
    }
    return this.save();
  },

  addRating(userId, rating, review = '') {
    // Check if user already rated
    const existingRatingIndex = this.ratings.findIndex(r => r.userId.equals(userId));
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      this.ratings[existingRatingIndex] = { userId, rating, review };
    } else {
      // Add new rating
      this.ratings.push({ userId, rating, review });
    }
    
    return this.save();
  },

  getCompatibilityForDevice(deviceInfo) {
    // Simple compatibility scoring - can be enhanced
    let score = this.compatibilityScore;
    
    // Check platform
    if (!this.targetPlatforms.includes(deviceInfo.platform)) {
      score -= 30;
    }
    
    // Check required features
    if (this.requiredFeatures && this.requiredFeatures.length > 0) {
      const missingFeatures = this.requiredFeatures.filter(
        f => !deviceInfo.supportedFeatures.includes(f)
      );
      score -= missingFeatures.length * 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }
};

const ARLearning = mongoose.model('ARLearning', arLearningSchema);

export default ARLearning;
