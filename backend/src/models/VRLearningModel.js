const mongoose = require('mongoose');

const vrLearningSchema = new mongoose.Schema({
  // **Core Metadata**
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  vrContentUrl: {
    type: String,
    required: [true, 'VR Content URL is required'],
    validate: {
      validator: (v) => /^(https?|wss?):\/\/[^\s/$.?#].[^\s]*$/i.test(v),
      message: 'Invalid URL format. Use http://, https://, or ws://'
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: (v) => !v || /^(https?):\/\/[^\s/$.?#].[^\s]*$/i.test(v),
      message: 'Thumbnail must be a valid HTTPS URL'
    }
  },

  // **Technical Specifications**
  contentType: {
    type: String,
    enum: ['3d-model', '360-video', 'interactive-simulation', 'ar-experience'],
    default: 'interactive-simulation'
  },
  supportedPlatforms: [{
    type: String,
    enum: ['oculus', 'hololens', 'webxr', 'android-ar', 'ios-ar'],
    required: true
  }],
  requiredBandwidthMbps: {
    type: Number,
    min: 1,
    max: 100,
    default: 15
  },
  fileSizeMB: {
    type: Number,
    min: 0.1
  },

  // **Educational Context**
  learningObjectives: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  targetAudience: {
    type: String,
    enum: ['k12', 'higher-ed', 'professional', 'consumer'],
    default: 'higher-ed'
  },
  estimatedDurationMinutes: {
    type: Number,
    min: 1,
    default: 20
  },
  difficulty: {
    type: String,
    enum: ['introductory', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },

  // **Access Control & Monetization**
  accessType: {
    type: String,
    enum: ['free', 'licensed', 'subscription'],
    default: 'free'
  },
  licenseKey: {
    type: String,
    select: false // Security: Never returned in queries
  },
  isPublished: {
    type: Boolean,
    default: false
  },

  // **Analytics & Engagement**
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  lastAccessed: Date,

  // **Relationships**
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],

  // **Timestamps**
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// **Indexes for Performance**
vrLearningSchema.index({ title: 'text', description: 'text' }); // Full-text search
vrLearningSchema.index({ contentType: 1 });
vrLearningSchema.index({ difficulty: 1, targetAudience: 1 });
vrLearningSchema.index({ views: -1 }); // Popular content
vrLearningSchema.index({ createdAt: -1 }); // Newest first

// **Pre-Save Hooks**
vrLearningSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Force HTTPS for all URLs
  if (this.isModified('vrContentUrl') && !this.vrContentUrl.match(/^https?:\/\//i)) {
    this.vrContentUrl = `https://${this.vrContentUrl}`;
  }
  
  // Normalize learning objectives
  if (this.isModified('learningObjectives')) {
    this.learningObjectives = this.learningObjectives.map(obj => obj.trim());
  }
  
  next();
});

// **Virtual Properties**
vrLearningSchema.virtual('accessibility').get(function() {
  return this.supportedPlatforms.includes('webxr') ? 'web-accessible' : 'headset-required';
});

// **Static Methods**
vrLearningSchema.statics.findByPlatform = function(platform) {
  return this.find({ 
    supportedPlatforms: platform,
    isPublished: true 
  }).sort({ averageRating: -1 });
};

vrLearningSchema.statics.getTrending = function() {
  return this.find({ isPublished: true })
             .sort({ views: -1, averageRating: -1 })
             .limit(10);
};

// **Instance Methods**
vrLearningSchema.methods.recordView = async function() {
  this.views += 1;
  this.lastAccessed = new Date();
  await this.save();
};

vrLearningSchema.methods.checkPlatformSupport = function(platform) {
  return this.supportedPlatforms.includes(platform);
};

module.exports = mongoose.model('VRLearning', vrLearningSchema);
