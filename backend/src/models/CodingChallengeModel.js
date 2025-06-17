const mongoose = require('mongoose');
const validator = require('validator');

const codingChallengeSchema = new mongoose.Schema({
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
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: [true, 'Difficulty is required'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['algorithms', 'data-structures', 'system-design', 'database', 'concurrency', 'frontend', 'backend'],
    index: true
  },
  codeTemplate: { 
    type: String,
    required: [true, 'Code template is required'],
    validate: {
      validator: function(v) {
        return v.length <= 5000;
      },
      message: 'Code template cannot exceed 5000 characters'
    }
  },
  solutionCode: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || v.length <= 5000;
      },
      message: 'Solution code cannot exceed 5000 characters'
    },
    select: false // Hidden by default
  },
  testCases: [{
    input: {
      type: String,
      required: [true, 'Test case input is required']
    },
    output: {
      type: String,
      required: [true, 'Test case output is required']
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    explanation: {
      type: String,
      maxlength: [500, 'Explanation cannot exceed 500 characters']
    }
  }],
  constraints: [{
    type: String,
    trim: true,
    maxlength: [200, 'Constraint cannot exceed 200 characters']
  }],
  timeLimit: {
    type: Number, // in milliseconds
    min: [100, 'Minimum time limit is 100ms'],
    max: [10000, 'Maximum time limit is 10000ms'],
    default: 2000
  },
  memoryLimit: {
    type: Number, // in MB
    min: [1, 'Minimum memory limit is 1MB'],
    max: [1024, 'Maximum memory limit is 1024MB'],
    default: 256
  },
  languageSupport: [{
    type: String,
    enum: ['javascript', 'python', 'java', 'c++', 'c#', 'go', 'ruby', 'swift'],
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
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
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove solution code from JSON output
      delete ret.solutionCode;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove solution code from object output
      delete ret.solutionCode;
      return ret;
    }
  }
});

// Indexes for optimized queries
codingChallengeSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
codingChallengeSchema.index({ difficulty: 1, category: 1 });
codingChallengeSchema.index({ popularity: -1 });
codingChallengeSchema.index({ tags: 1 });
codingChallengeSchema.index({ createdAt: -1 });

// Pre-save hook to update timestamps
codingChallengeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual properties
codingChallengeSchema.virtual('testCaseCount').get(function() {
  return this.testCases.length;
});

codingChallengeSchema.virtual('visibleTestCases').get(function() {
  return this.testCases.filter(tc => !tc.isHidden);
});

// Static methods
codingChallengeSchema.statics.getRandomChallenge = function(difficulty, category) {
  const query = { isActive: true };
  if (difficulty) query.difficulty = difficulty;
  if (category) query.category = category;

  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

codingChallengeSchema.statics.getByDifficulty = function(difficulty, limit = 10) {
  return this.find({ 
    difficulty,
    isActive: true 
  })
  .sort({ popularity: -1 })
  .limit(limit);
};

codingChallengeSchema.statics.incrementPopularity = function(challengeId) {
  return this.findByIdAndUpdate(
    challengeId,
    { $inc: { popularity: 1 } },
    { new: true }
  );
};

// Instance methods
codingChallengeSchema.methods.addTestCase = function(testCase) {
  this.testCases.push(testCase);
  return this.save();
};

codingChallengeSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);
