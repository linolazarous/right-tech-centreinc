const mongoose = require('mongoose');
const { DO_SPACE_URL } = process.env;

const skillsAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Critical for DigitalOcean query performance
    },
    skill: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
      enum: {
        values: ['JavaScript', 'Python', 'Data Analysis', 'UI/UX', 'Project Management', 'Digital Marketing', 'Cloud Computing'],
        message: 'Invalid skill category'
      }
    },
    score: {
      type: Number,
      required: [true, 'Assessment score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100']
    },
    assessmentType: {
      type: String,
      required: true,
      enum: ['test', 'practical', 'peer-review', 'self-assessment'],
      default: 'test'
    },
    evidence: {
      url: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || v.startsWith(DO_SPACE_URL);
          },
          message: 'Evidence must be hosted on DigitalOcean Spaces'
        }
      },
      description: String
    },
    competencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: function() {
        if (this.score >= 80) return 'expert';
        if (this.score >= 60) return 'advanced';
        if (this.score >= 40) return 'intermediate';
        return 'beginner';
      }
    },
    retakeAvailable: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v > new Date();
        },
        message: 'Expiration must be in the future'
      }
    }
  },
  {
    // DigitalOcean Optimized Settings
    timestamps: true, // createdAt and updatedAt
    strict: true, // Reject undefined fields
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
skillsAssessmentSchema.index({ skill: 1, score: -1 }); // For skill leaderboards
skillsAssessmentSchema.index({ userId: 1, competencyLevel: 1 }); // For user skill profiles
skillsAssessmentSchema.index({ createdAt: -1 }); // For recent assessments

// Virtual for expiration status (DigitalOcean monitoring friendly)
skillsAssessmentSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Query Helpers for DigitalOcean Efficiency
skillsAssessmentSchema.query.byUser = function(userId) {
  return this.where({ userId }).lean(); // Lean for memory efficiency
};

skillsAssessmentSchema.query.byCompetency = function(level) {
  return this.where({ competencyLevel: level });
};

// DigitalOcean Monitoring Hooks
skillsAssessmentSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Assessment saved - User: ${doc.userId}, Skill: ${doc.skill}, Score: ${doc.score}`);
});

// Auto-update competency level when score changes
skillsAssessmentSchema.pre('save', function(next) {
  if (this.isModified('score')) {
    if (this.score >= 80) this.competencyLevel = 'expert';
    else if (this.score >= 60) this.competencyLevel = 'advanced';
    else if (this.score >= 40) this.competencyLevel = 'intermediate';
    else this.competencyLevel = 'beginner';
  }
  next();
});

// Expiration check middleware
skillsAssessmentSchema.pre(/^find/, function(next) {
  if (this.getFilter().expiresAt === undefined) {
    this.where({ expiresAt: { $exists: false } }).orWhere({ expiresAt: { $gt: new Date() } });
  }
  next();
});

module.exports = mongoose.model('SkillsAssessment', skillsAssessmentSchema);
