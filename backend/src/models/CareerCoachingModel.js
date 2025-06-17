const mongoose = require('mongoose');
const validator = require('validator');

const careerCoachingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  coachId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Coach ID is required'],
    index: true
  },
  sessionDate: { 
    type: Date, 
    required: [true, 'Session date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Session date must be in the future'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum session duration is 15 minutes'],
    max: [240, 'Maximum session duration is 240 minutes'],
    default: 60
  },
  sessionType: {
    type: String,
    required: [true, 'Session type is required'],
    enum: ['career-strategy', 'resume-review', 'interview-prep', 'salary-negotiation', 'leadership', 'custom'],
    default: 'career-strategy'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'scheduled',
    index: true
  },
  meetingLink: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional until session is scheduled
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'Invalid meeting URL'
    }
  },
  notes: { 
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    trim: true
  },
  coachNotes: {
    type: String,
    maxlength: [2000, 'Coach notes cannot exceed 2000 characters'],
    trim: true,
    select: false // Only visible to coaches/admins
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    trim: true
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerCoaching'
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
    trim: true
  },
  remindersSent: {
    type: Number,
    default: 0,
    max: [3, 'Maximum 3 reminders allowed']
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
  completedAt: {
    type: Date
  }
}, {
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
careerCoachingSchema.index({ userId: 1, sessionDate: 1 });
careerCoachingSchema.index({ coachId: 1, sessionDate: 1 });
careerCoachingSchema.index({ sessionDate: 1, status: 1 });
careerCoachingSchema.index({ sessionType: 1, status: 1 });
careerCoachingSchema.index({ status: 1, createdAt: 1 });

// Pre-save hooks
careerCoachingSchema.pre('save', function(next) {
  // Update completedAt if status changed to completed
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual properties
careerCoachingSchema.virtual('isPast').get(function() {
  return this.sessionDate < new Date();
});

careerCoachingSchema.virtual('timeRemaining').get(function() {
  return this.sessionDate - new Date();
});

// Static methods
careerCoachingSchema.statics.getUpcomingSessions = function(userId, limit = 5) {
  return this.find({ 
    userId,
    status: 'scheduled',
    sessionDate: { $gt: new Date() }
  })
  .sort({ sessionDate: 1 })
  .limit(limit)
  .populate('coachId', 'name profilePicture');
};

careerCoachingSchema.statics.getCoachSchedule = function(coachId, startDate, endDate) {
  return this.find({
    coachId,
    sessionDate: { 
      $gte: startDate,
      $lte: endDate 
    },
    status: { $in: ['scheduled', 'rescheduled'] }
  })
  .sort({ sessionDate: 1 })
  .populate('userId', 'name email');
};

careerCoachingSchema.statics.cancelSession = async function(sessionId, reason) {
  return this.findByIdAndUpdate(
    sessionId,
    { 
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: new Date()
    },
    { new: true }
  );
};

// Instance methods
careerCoachingSchema.methods.rescheduleSession = function(newDate) {
  this.status = 'rescheduled';
  this.sessionDate = newDate;
  return this.save();
};

module.exports = mongoose.model('CareerCoaching', careerCoachingSchema);
