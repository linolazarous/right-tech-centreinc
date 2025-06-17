const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const proctoringSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required'],
    index: true
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true,
    index: true
  },
  // Timing Information
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    index: true
  },
  scheduledStartTime: {
    type: Date,
    required: [true, 'Scheduled start time is required']
  },
  endTime: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > this.startTime;
      },
      message: 'End time must be after start time'
    },
    index: true
  },
  // Technical Information
  deviceInfo: {
    os: String,
    browser: String,
    ipAddress: String,
    screenResolution: String,
    deviceType: String
  },
  // Authentication Details
  authentication: {
    method: {
      type: String,
      enum: ['password', 'biometric', '2fa', 'proctoring'],
      default: 'password'
    },
    photos: [String], // Array of photo URLs
    verified: Boolean
  },
  // Monitoring Data
  activityLogs: [{
    timestamp: { type: Date, required: true },
    eventType: { 
      type: String,
      enum: [
        'tab_switch', 
        'window_resize', 
        'copy_attempt',
        'paste_attempt',
        'face_not_visible',
        'multiple_faces',
        'voice_detected',
        'noise_detected',
        'device_disconnect',
        'reconnect'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    screenshot: String, // URL to screenshot
    metadata: Object
  }],
  // Flagged Events
  flaggedEvents: [{
    type: {
      type: String,
      enum: [
        'cheating_suspected',
        'identity_verification_failed',
        'environment_violation',
        'timeout_violation',
        'technical_issue'
      ],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    description: String,
    evidence: [String], // URLs to screenshots/videos
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: String,
    actionTaken: {
      type: String,
      enum: [
        'none',
        'warning',
        'exam_paused',
        'exam_terminated',
        'score_adjusted',
        'disqualified'
      ],
      default: 'none'
    }
  }],
  // Video Recording
  recording: {
    status: {
      type: String,
      enum: ['not_started', 'recording', 'completed', 'failed'],
      default: 'not_started'
    },
    url: String,
    segments: [{
      startTime: Date,
      endTime: Date,
      url: String,
      sizeMB: Number
    }]
  },
  // System Checks
  systemChecks: {
    camera: Boolean,
    microphone: Boolean,
    networkStability: Boolean,
    fullScreen: Boolean,
    browserLock: Boolean
  },
  // Session Status
  status: {
    type: String,
    enum: [
      'scheduled',
      'started',
      'in_progress',
      'paused',
      'completed',
      'terminated',
      'technical_failure'
    ],
    default: 'scheduled',
    index: true
  },
  // Performance Metrics
  performanceMetrics: {
    averageLatency: Number,
    packetLoss: Number,
    frameRate: Number,
    audioQuality: Number
  },
  // Additional Metadata
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

// Indexes for optimized queries
proctoringSchema.index({ userId: 1, examId: 1 });
proctoringSchema.index({ 'flaggedEvents.reviewed': 1 });
proctoringSchema.index({ startTime: -1 });
proctoringSchema.index({ status: 1, startTime: 1 });
proctoringSchema.index({ 'activityLogs.eventType': 1 });
proctoringSchema.index({ 'activityLogs.timestamp': 1 });

// Pre-save hooks
proctoringSchema.pre('save', function(next) {
  // Update status based on timestamps
  if (this.isModified('startTime') && !this.endTime) {
    this.status = 'in_progress';
  }
  if (this.isModified('endTime') && this.endTime) {
    this.status = 'completed';
  }
  next();
});

// Static Methods
proctoringSchema.statics.findActiveSessions = async function() {
  try {
    return await this.find({ 
      status: { $in: ['started', 'in_progress', 'paused'] } 
    }).populate('userId examId', 'name email title duration');
  } catch (error) {
    logger.error('Error finding active proctoring sessions:', error);
    throw error;
  }
};

proctoringSchema.statics.findFlaggedSessions = async function() {
  try {
    return await this.find({ 
      'flaggedEvents.reviewed': false 
    }).sort({ startTime: -1 });
  } catch (error) {
    logger.error('Error finding flagged proctoring sessions:', error);
    throw error;
  }
};

// Instance Methods
proctoringSchema.methods.addActivityEvent = async function(eventData) {
  try {
    this.activityLogs.push(eventData);
    await this.save();
    return this;
  } catch (error) {
    logger.error(`Error adding activity event to session ${this._id}:`, error);
    throw error;
  }
};

proctoringSchema.methods.flagEvent = async function(flagData) {
  try {
    this.flaggedEvents.push(flagData);
    this.status = flagData.type === 'exam_terminated' ? 'terminated' : this.status;
    await this.save();
    return this;
  } catch (error) {
    logger.error(`Error flagging event in session ${this._id}:`, error);
    throw error;
  }
};

proctoringSchema.methods.completeSession = async function() {
  try {
    this.endTime = new Date();
    this.status = 'completed';
    await this.save();
    return this;
  } catch (error) {
    logger.error(`Error completing session ${this._id}:`, error);
    throw error;
  }
};

// Virtuals
proctoringSchema.virtual('durationMinutes').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  return (this.endTime - this.startTime) / (1000 * 60);
});

proctoringSchema.virtual('isActive').get(function() {
  return ['started', 'in_progress', 'paused'].includes(this.status);
});

proctoringSchema.virtual('severityScore').get(function() {
  const scores = { low: 1, medium: 3, high: 5 };
  return this.activityLogs.reduce((sum, log) => sum + (scores[log.severity] || 0), 0);
});

const Proctoring = mongoose.model('Proctoring', proctoringSchema);

module.exports = Proctoring;
