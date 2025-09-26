import mongoose from 'mongoose';

const skillsAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  maxScore: {
    type: Number,
    default: 100
  },
  assessmentType: {
    type: String,
    enum: ['quiz', 'practical', 'theoretical', 'combined'],
    default: 'quiz'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  timeSpent: {
    type: Number,
    min: 0,
    default: 0
  },
  totalQuestions: {
    type: Number,
    min: 1,
    default: 10
  },
  correctAnswers: {
    type: Number,
    min: 0,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    suggestions: [String]
  },
  resources: [{
    type: {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['article', 'video', 'course', 'book', 'tutorial']
      }
    }
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

skillsAssessmentSchema.index({ userId: 1, skillName: 1 });
skillsAssessmentSchema.index({ category: 1, score: -1 });
skillsAssessmentSchema.index({ createdAt: -1 });
skillsAssessmentSchema.index({ passed: 1 });

skillsAssessmentSchema.pre('save', function(next) {
  if (this.isModified('score')) {
    this.passed = this.score >= 70;
  }
  next();
});

skillsAssessmentSchema.statics.findByUserAndSkill = async function(userId, skillName) {
  try {
    return await this.find({ userId, skillName })
      .sort({ createdAt: -1 })
      .limit(5);
  } catch (error) {
    console.error(`Error finding assessments for user ${userId} and skill ${skillName}:`, error);
    throw error;
  }
};

skillsAssessmentSchema.statics.getUserSkillsSummary = async function(userId) {
  try {
    return await this.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$skillName',
          latestScore: { $last: '$score' },
          assessmentCount: { $sum: 1 },
          averageScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          lastAssessed: { $max: '$createdAt' }
        }
      },
      { $sort: { lastAssessed: -1 } }
    ]);
  } catch (error) {
    console.error(`Error getting skills summary for user ${userId}:`, error);
    throw error;
  }
};

skillsAssessmentSchema.methods.calculatePercentage = function() {
  return (this.score / this.maxScore) * 100;
};

skillsAssessmentSchema.virtual('performanceLevel').get(function() {
  const percentage = this.calculatePercentage();
  if (percentage >= 90) return 'expert';
  if (percentage >= 70) return 'proficient';
  if (percentage >= 50) return 'intermediate';
  return 'beginner';
});

skillsAssessmentSchema.virtual('needsImprovement').get(function() {
  return this.score < 70;
});

export default mongoose.model('SkillsAssessment', skillsAssessmentSchema);
