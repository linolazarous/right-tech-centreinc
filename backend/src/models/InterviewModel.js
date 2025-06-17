const mongoose = require('mongoose');
const validator = require('validator');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required'],
    index: true
  },
  interviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Interviewer ID is required'],
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    index: true
  },
  interviewDate: {
    type: Date,
    required: [true, 'Interview date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Interview date must be in the future'
    }
  },
  duration: {
    type: Number,
    min: [15, 'Minimum duration is 15 minutes'],
    max: [480, 'Maximum duration is 8 hours'],
    default: 60
  },
  interviewType: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'hr', 'panel', 'phone-screen'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled',
    index: true
  },
  meetingLink: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid meeting URL'
    }
  },
  feedback: {
    candidate: {
      technical: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      problemSolving: { type: Number, min: 1, max: 5 },
      notes: { type: String, maxlength: 2000 }
    },
    interviewer: {
      experience: { type: Number, min: 1, max: 5 },
      preparation: { type: Number, min: 1, max: 5 },
      notes: { type: String, maxlength: 2000 }
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      set: v => parseFloat(v.toFixed(1)) // Store with 1 decimal place
    },
    decision: {
      type: String,
      enum: ['hire', 'reject', 'strong-hire', 'consider', 'additional-round']
    }
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  },
  recordingUrl: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid recording URL'
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
  },
  completedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: false // Managing timestamps manually
});

// Indexes for optimized queries
interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ interviewerId: 1, interviewDate: 1 });
interviewSchema.index({ interviewDate: 1, status: 1 });
interviewSchema.index({ 'feedback.decision': 1 });
interviewSchema.index({ interviewType: 1, status: 1 });

// Virtuals
interviewSchema.virtual('timeUntilInterview').get(function() {
  return this.interviewDate - new Date();
});

interviewSchema.virtual('isPast').get(function() {
  return this.interviewDate < new Date();
});

interviewSchema.virtual('durationHours').get(function() {
  return (this.duration / 60).toFixed(1);
});

// Hooks
interviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }

  // Calculate overall rating if feedback components exist
  if (this.feedback?.candidate && !this.feedback.overallRating) {
    const { technical, communication, problemSolving } = this.feedback.candidate;
    if (technical && communication && problemSolving) {
      this.feedback.overallRating = (technical + communication + problemSolving) / 3;
    }
  }

  next();
});

// Methods
interviewSchema.methods.reschedule = async function(newDate, duration) {
  if (newDate <= new Date()) {
    throw new Error('New interview date must be in the future');
  }

  this.interviewDate = newDate;
  if (duration) this.duration = duration;
  this.status = 'rescheduled';
  await this.save();
};

interviewSchema.methods.completeInterview = async function(feedback) {
  this.status = 'completed';
  this.feedback = feedback;
  this.completedAt = new Date();
  await this.save();
};

interviewSchema.methods.cancelInterview = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  await this.save();
};

// Static methods
interviewSchema.statics.getUpcomingInterviews = function(userId, limit = 5) {
  return this.find({ 
    userId,
    status: 'scheduled',
    interviewDate: { $gt: new Date() }
  })
  .sort({ interviewDate: 1 })
  .limit(limit)
  .populate('interviewerId', 'name avatar')
  .populate('jobId', 'title company')
  .lean();
};

interviewSchema.statics.getInterviewHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ interviewDate: -1 })
    .limit(limit)
    .populate('interviewerId', 'name position')
    .populate('jobId', 'title company')
    .lean();
};

interviewSchema.statics.getInterviewerSchedule = function(interviewerId, startDate, endDate) {
  return this.find({
    interviewerId,
    interviewDate: { 
      $gte: startDate,
      $lte: endDate 
    },
    status: { $in: ['scheduled', 'rescheduled'] }
  })
  .sort({ interviewDate: 1 })
  .lean();
};

module.exports = mongoose.model('Interview', interviewSchema);
