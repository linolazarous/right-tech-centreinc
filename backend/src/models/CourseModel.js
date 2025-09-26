import mongoose from 'mongoose';
import validator from 'validator';

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Course title is required'],
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
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Instructor ID is required'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'business', 'design', 'languages', 'health', 'personal-development'],
    index: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
    index: true
  },
  price: {
    amount: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY']
    },
    isFree: {
      type: Boolean,
      default: true
    }
  },
  duration: { // in hours
    type: Number,
    min: [0, 'Duration cannot be negative'],
    required: [true, 'Duration is required']
  },
  lessons: [{
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [100, 'Lesson title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Lesson description cannot exceed 500 characters']
    },
    duration: { // in minutes
      type: Number,
      min: [0, 'Duration cannot be negative'],
      default: 0
    },
    videoUrl: {
      type: String,
      validate: {
        validator: function(v) {
          return validator.isURL(v, {
            protocols: ['http', 'https'],
            require_protocol: true,
            allow_underscores: true
          });
        },
        message: 'Invalid video URL'
      }
    },
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningResource'
    }],
    isPreview: {
      type: Boolean,
      default: false
    }
  }],
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/empty
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid thumbnail URL'
    }
  },
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
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  learningOutcomes: [{
    type: String,
    trim: true,
    maxlength: [200, 'Learning outcome cannot exceed 200 characters']
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      required: true
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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

// Indexes for optimized queries
courseSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isFeatured: 1, publishedAt: -1 });
courseSchema.index({ 'price.amount': 1 });
courseSchema.index({ tags: 1 });

// Pre-save hooks
courseSchema.pre('save', function(next) {
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published') {
    this.publishedAt = new Date();
    this.isPublished = true;
  }
  
  // Calculate total duration from lessons if lessons are modified
  if (this.isModified('lessons')) {
    const totalMinutes = this.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    this.duration = Math.round((totalMinutes / 60) * 100) / 100; // Convert minutes to hours with 2 decimal places
  }
  
  // Ensure price consistency
  if (this.isModified('price.amount')) {
    this.price.isFree = this.price.amount === 0;
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual properties
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

courseSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal place
});

courseSchema.virtual('totalLessons').get(function() {
  return this.lessons ? this.lessons.length : 0;
});

courseSchema.virtual('totalStudents').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Static methods
courseSchema.statics.getPublishedCourses = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('instructor', 'name avatar');
};

courseSchema.statics.getByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId })
    .sort({ createdAt: -1 })
    .populate('instructor', 'name avatar');
};

courseSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    category,
    status: 'published' 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('instructor', 'name avatar');
};

courseSchema.statics.getFeaturedCourses = function(limit = 5) {
  return this.find({ 
    isFeatured: true, 
    status: 'published' 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('instructor', 'name avatar');
};

// Instance methods
courseSchema.methods.enrollStudent = function(userId) {
  if (!this.enrolledStudents.includes(userId)) {
    this.enrolledStudents.push(userId);
  }
  return this.save();
};

courseSchema.methods.unenrollStudent = function(userId) {
  this.enrolledStudents = this.enrolledStudents.filter(id => !id.equals(userId));
  return this.save();
};

courseSchema.methods.addRating = function(userId, rating, review) {
  // Check if user already rated
  const existingRatingIndex = this.ratings.findIndex(r => r.userId.equals(userId));
  
  if (existingRatingIndex >= 0) {
    // Update existing rating
    this.ratings[existingRatingIndex] = { 
      userId, 
      rating, 
      review, 
      createdAt: new Date() 
    };
  } else {
    // Add new rating
    this.ratings.push({ 
      userId, 
      rating, 
      review, 
      createdAt: new Date() 
    });
  }
  
  return this.save();
};

courseSchema.methods.removeRating = function(userId) {
  this.ratings = this.ratings.filter(rating => !rating.userId.equals(userId));
  return this.save();
};

courseSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  this.isPublished = true;
  return this.save();
};

courseSchema.methods.unpublish = function() {
  this.status = 'draft';
  this.isPublished = false;
  return this.save();
};

courseSchema.methods.addLesson = function(lessonData) {
  this.lessons.push(lessonData);
  return this.save();
};

courseSchema.methods.updateLesson = function(lessonId, lessonData) {
  const lessonIndex = this.lessons.findIndex(lesson => lesson._id.equals(lessonId));
  if (lessonIndex !== -1) {
    this.lessons[lessonIndex] = { ...this.lessons[lessonIndex].toObject(), ...lessonData };
  }
  return this.save();
};

courseSchema.methods.removeLesson = function(lessonId) {
  this.lessons = this.lessons.filter(lesson => !lesson._id.equals(lessonId));
  return this.save();
};

const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
