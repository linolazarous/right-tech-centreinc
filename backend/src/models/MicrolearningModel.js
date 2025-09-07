import mongoose from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

const microlearningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    minlength: [5, 'Title must be at least 5 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [150, 'Short description cannot exceed 150 characters']
  },
  contentUrl: {
    type: String,
    required: [true, 'Content URL is required'],
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true
        });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [60, 'Duration cannot exceed 60 minutes']
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  contentType: {
    type: String,
    enum: ['video', 'article', 'interactive', 'podcast', 'quiz'],
    required: [true, 'Content type is required']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ru']
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 15;
      },
      message: 'Cannot have more than 15 tags'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningCategory'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    required: function() {
      return this.isPublished;
    }
  },
  isFree: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: [0, 'Completion rate cannot be less than 0'],
    max: [100, 'Completion rate cannot exceed 100']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Microlearning'
  }],
  relatedContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Microlearning'
  }],
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

microlearningSchema.index({ title: 'text', description: 'text', tags: 'text' });
microlearningSchema.index({ slug: 1 }, { unique: true });
microlearningSchema.index({ contentType: 1, difficultyLevel: 1 });
microlearningSchema.index({ category: 1, isPublished: 1 });
microlearningSchema.index({ author: 1 });
microlearningSchema.index({ viewCount: -1 });
microlearningSchema.index({ rating: -1 });
microlearningSchema.index({ publishedAt: -1 });

microlearningSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

microlearningSchema.statics.findBySlug = async function(slug) {
  try {
    return await this.findOne({ slug }).populate('author category');
  } catch (error) {
    console.error(`Error finding microlearning by slug ${slug}:`, error);
    throw error;
  }
};

microlearningSchema.statics.findPublished = async function() {
  try {
    return await this.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .populate('author category');
  } catch (error) {
    console.error('Error fetching published microlearnings:', error);
    throw error;
  }
};

microlearningSchema.methods.incrementViewCount = async function() {
  try {
    this.viewCount += 1;
    await this.save();
    return this;
  } catch (error) {
    console.error(`Error incrementing view count for ${this.slug}:`, error);
    throw error;
  }
};

microlearningSchema.methods.updateCompletionRate = async function(newRate) {
  try {
    if (newRate >= 0 && newRate <= 100) {
      this.completionRate = newRate;
      await this.save();
    }
    return this;
  } catch (error) {
    console.error(`Error updating completion rate for ${this.slug}:`, error);
    throw error;
  }
};

microlearningSchema.virtual('formattedDuration').get(function() {
  return `${this.duration} min`;
});

export default mongoose.model('Microlearning', microlearningSchema);
