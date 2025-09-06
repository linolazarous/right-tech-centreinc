import mongoose from 'mongoose';
import validator from 'validator';

const careerPathSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true
  },
  description: { 
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  steps: [{
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
      maxlength: [100, 'Step title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
      trim: true,
      maxlength: [500, 'Step description cannot exceed 500 characters']
    },
    duration: {
      type: Number, // in days
      min: [0, 'Duration cannot be negative'],
      default: 30
    },
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningResource'
    }],
    isMilestone: {
      type: Boolean,
      default: false
    },
    completedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'business', 'healthcare', 'creative', 'professional', 'trades'],
    index: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
    index: true
  },
  estimatedDuration: {
    type: Number, // in days
    min: [0, 'Duration cannot be negative'],
    required: [true, 'Estimated duration is required']
  },
  salaryRange: {
    min: {
      type: Number,
      min: [0, 'Salary cannot be negative']
    },
    max: {
      type: Number,
      validate: {
        validator: function(v) {
          return v >= this.salaryRange.min;
        },
        message: 'Max salary must be greater than min salary'
      }
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY']
    }
  },
  popularity: {
    type: Number,
    default: 0,
    min: [0, 'Popularity cannot be negative']
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
careerPathSchema.index({ title: 'text', description: 'text', 'steps.title': 'text' });
careerPathSchema.index({ category: 1, difficulty: 1 });
careerPathSchema.index({ popularity: -1 });
careerPathSchema.index({ estimatedDuration: 1 });
careerPathSchema.index({ tags: 1 });

// Pre-save hook to update timestamps
careerPathSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate estimated duration if not set
  if (this.isModified('steps') && !this.isModified('estimatedDuration')) {
    this.estimatedDuration = this.steps.reduce((sum, step) => sum + (step.duration || 0), 0);
  }
  
  next();
});

// Virtual properties
careerPathSchema.virtual('completionCount').get(function() {
  return this.steps.reduce((count, step) => count + step.completedBy.length, 0);
});

careerPathSchema.virtual('averageCompletionTime').get(function() {
  // This would be calculated based on actual user data
  return this.estimatedDuration * 0.8; // Example: 20% faster than estimate
});

// Static methods
careerPathSchema.statics.getFeaturedPaths = function(limit = 5) {
  return this.find({ 
    isFeatured: true,
    isActive: true 
  })
  .sort({ popularity: -1 })
  .limit(limit);
};

careerPathSchema.statics.getByCategory = function(category, difficulty) {
  const query = { 
    category,
    isActive: true 
  };
  
  if (difficulty) query.difficulty = difficulty;
  
  return this.find(query)
    .sort({ popularity: -1 });
};

careerPathSchema.statics.searchPaths = function(searchTerm, limit = 10) {
  return this.find(
    { $text: { $search: searchTerm }, isActive: true },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

// Instance methods
careerPathSchema.methods.addStep = function(step) {
  this.steps.push(step);
  return this.save();
};

careerPathSchema.methods.markStepCompleted = function(stepIndex, userId) {
  if (!this.steps[stepIndex].completedBy.includes(userId)) {
    this.steps[stepIndex].completedBy.push(userId);
  }
  return this.save();
};

const CareerPath = mongoose.model('CareerPath', careerPathSchema);

export default CareerPath;
