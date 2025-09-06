import mongoose from 'mongoose';
import validator from 'validator';

const contentCreationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
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
  contentType: { 
    type: String, 
    enum: ['blog', 'video', 'podcast', 'tutorial', 'ebook', 'infographic', 'cheatsheet', 'live-stream'],
    required: [true, 'Content type is required'],
    index: true
  },
  contentUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid content URL'
    }
  },
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
  duration: { // in minutes
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  wordCount: {
    type: Number,
    min: [0, 'Word count cannot be negative']
  },
  categories: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Category cannot exceed 30 characters']
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator ID is required'],
    index: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['editor', 'reviewer', 'contributor'],
      required: true
    }
  }],
  seoMetadata: {
    keywords: [String],
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain letters, numbers and hyphens'],
      unique: true,
      index: true
    }
  },
  engagementStats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    shares: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: {
      type: Number,
      default: 0,
      min: 0
    }
  },
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
contentCreationSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
contentCreationSchema.index({ contentType: 1, status: 1 });
contentCreationSchema.index({ createdBy: 1, status: 1 });
contentCreationSchema.index({ isFeatured: 1, publishedAt: -1 });
contentCreationSchema.index({ 'engagementStats.views': -1 });
contentCreationSchema.index({ tags: 1 });
contentCreationSchema.index({ categories: 1 });

// Pre-save hooks
contentCreationSchema.pre('save', function(next) {
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published') {
    this.publishedAt = new Date();
    this.isPublished = true;
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual properties
contentCreationSchema.virtual('readingTime').get(function() {
  if (!this.wordCount) return null;
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(this.wordCount / wordsPerMinute);
});

contentCreationSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Static methods
contentCreationSchema.statics.getPublishedContent = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name avatar');
};

contentCreationSchema.statics.getByCreator = function(userId, options = {}) {
  const query = { createdBy: userId };
  if (options.status) query.status = options.status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('updatedBy', 'name');
};

contentCreationSchema.statics.incrementEngagement = function(contentId, field) {
  const validFields = ['views', 'likes', 'shares', 'comments'];
  if (!validFields.includes(field)) {
    throw new Error('Invalid engagement field');
  }

  return this.findByIdAndUpdate(
    contentId,
    { $inc: { [`engagementStats.${field}`]: 1 } },
    { new: true }
  );
};

// Instance methods
contentCreationSchema.methods.publish = function() {
  this.status = 'published';
  return this.save();
};

contentCreationSchema.methods.addCollaborator = function(userId, role) {
  if (!this.collaborators.some(c => c.user.equals(userId))) {
    this.collaborators.push({ user: userId, role });
  }
  return this.save();
};

const ContentCreation = mongoose.model('ContentCreation', contentCreationSchema);

export default ContentCreation;
