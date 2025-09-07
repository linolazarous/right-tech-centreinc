import mongoose from 'mongoose';
import validator from 'validator';

const learningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    text: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    validate: {
      validator: v => /^[a-z0-9-]+$/.test(v),
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
    default: ''
  },
  thumbnail: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid thumbnail URL'
    }
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    validate: {
      validator: function(courses) {
        return courses.length <= 50;
      },
      message: 'Cannot have more than 50 courses in a learning path'
    }
  }],
  duration: {
    estimated: { type: Number, min: 0 },
    averageCompletion: { type: Number, min: 0 }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'design', 'business', 'data-science', 'personal-growth']
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
    lowercase: true
  }],
  prerequisites: [{
    type: String,
    maxlength: [100, 'Prerequisite cannot exceed 100 characters']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  stats: {
    enrollments: { type: Number, default: 0, min: 0 },
    completions: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 }
  },
  publishedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: false
});

learningPathSchema.index({ title: 'text', description: 'text', tags: 'text' });
learningPathSchema.index({ category: 1, difficulty: 1 });
learningPathSchema.index({ 'stats.averageRating': -1 });
learningPathSchema.index({ 'stats.enrollments': -1 });
learningPathSchema.index({ createdBy: 1, status: 1 });
learningPathSchema.index({ slug: 1 }, { unique: true });

learningPathSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  shortDescription: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    shortDescription: 3,
    description: 1
  },
  name: 'learning_path_text_search'
});

learningPathSchema.virtual('completionRate').get(function() {
  return this.stats.enrollments > 0 
    ? (this.stats.completions / this.stats.enrollments * 100).toFixed(1)
    : 0;
});

learningPathSchema.virtual('isNew').get(function() {
  return new Date() - this.publishedAt < 30 * 24 * 60 * 60 * 1000;
});

learningPathSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 200).replace(/\n/g, ' ').trim();
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

learningPathSchema.methods.incrementEnrollments = async function() {
  this.stats.enrollments += 1;
  await this.save();
};

learningPathSchema.methods.incrementCompletions = async function() {
  this.stats.completions += 1;
  await this.save();
};

learningPathSchema.methods.updateRating = async function(newRating) {
  const totalRating = this.stats.averageRating * this.stats.reviewsCount + newRating;
  this.stats.reviewsCount += 1;
  this.stats.averageRating = totalRating / this.stats.reviewsCount;
  await this.save();
};

learningPathSchema.statics.getFeaturedPaths = function(limit = 5) {
  return this.find({ isFeatured: true, status: 'published' })
    .sort({ 'stats.enrollments': -1 })
    .limit(limit)
    .select('title shortDescription thumbnail stats slug')
    .lean();
};

learningPathSchema.statics.recalculateDurations = async function() {
  const paths = await this.find().populate('courses', 'duration');
  
  const bulkOps = paths.map(path => {
    const totalDuration = path.courses.reduce((sum, course) => sum + (course.duration || 0), 0);
    return {
      updateOne: {
        filter: { _id: path._id },
        update: { $set: { 'duration.estimated': totalDuration } }
      }
    };
  });

  await this.bulkWrite(bulkOps);
  return paths.length;
};

export default mongoose.model('LearningPath', learningPathSchema);
