const mongoose = require('mongoose');

const zoomSchema = new mongoose.Schema({
  // **Core Meeting Data**
  meetingId: {
    type: String,
    required: [true, 'Meeting ID is required'],
    unique: true,
    index: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host ID is required']
  },
  topic: {
    type: String,
    trim: true,
    maxlength: [200, 'Topic cannot exceed 200 characters'],
    default: 'Untitled Meeting'
  },
  agenda: {
    type: String,
    trim: true,
    maxlength: [2000, 'Agenda cannot exceed 2000 characters']
  },

  // **Timing Information**
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    index: true
  },
  endTime: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  timezone: {
    type: String,
    default: 'UTC',
    enum: Intl.supportedValuesOf('timeZone')
  },

  // **Meeting Configuration**
  meetingType: {
    type: String,
    enum: ['instant', 'scheduled', 'recurring'],
    default: 'scheduled'
  },
  duration: {
    type: Number, // in minutes
    min: 1,
    max: 1440, // 24 hours
    required: true
  },
  password: {
    type: String,
    select: false,
    minlength: 6
  },
  settings: {
    waitingRoom: { type: Boolean, default: true },
    recordAutomatically: { type: Boolean, default: false },
    muteOnEntry: { type: Boolean, default: true }
  },

  // **Participants & Engagement**
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinTime: Date,
    leaveTime: Date,
    duration: Number // in minutes
  }],
  maxParticipants: {
    type: Number,
    min: 1,
    default: 100
  },
  recordingUrl: {
    type: String,
    validate: {
      validator: (v) => !v || /^https:\/\/.+/i.test(v),
      message: 'Recording URL must be HTTPS'
    }
  },

  // **Analytics**
  totalParticipants: {
    type: Number,
    default: 0
  },
  averageAttendanceDuration: {
    type: Number, // in minutes
    default: 0
  },

  // **Status & Timestamps**
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'canceled'],
    default: 'scheduled',
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// **Indexes for Performance**
zoomSchema.index({ hostId: 1 });
zoomSchema.index({ startTime: 1, endTime: 1 });
zoomSchema.index({ status: 1, startTime: 1 });
zoomSchema.index({ 'participants.user': 1 });

// **Pre-Save Hooks**
zoomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-calculate duration if endTime is set
  if (this.isModified('endTime') && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  
  // Update status based on timing
  const now = new Date();
  if (this.status !== 'canceled') {
    if (now < this.startTime) {
      this.status = 'scheduled';
    } else if (now >= this.startTime && (!this.endTime || now <= this.endTime)) {
      this.status = 'in-progress';
    } else if (this.endTime && now > this.endTime) {
      this.status = 'completed';
    }
  }
  
  next();
});

// **Virtual Properties**
zoomSchema.virtual('isActive').get(function() {
  const now = new Date();
  return now >= this.startTime && (!this.endTime || now <= this.endTime);
});

zoomSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// **Static Methods**
zoomSchema.statics.findUpcoming = function() {
  return this.find({ 
    status: 'scheduled',
    startTime: { $gt: new Date() }
  }).sort({ startTime: 1 });
};

zoomSchema.statics.findByHost = function(hostId) {
  return this.find({ hostId })
             .sort({ startTime: -1 });
};

// **Instance Methods**
zoomSchema.methods.addParticipant = function(userId) {
  if (!this.participants.some(p => p.user.equals(userId))) {
    this.participants.push({ user: userId, joinTime: new Date() });
    this.totalParticipants += 1;
  }
  return this.save();
};

zoomSchema.methods.endMeeting = function() {
  this.endTime = new Date();
  this.status = 'completed';
  
  // Calculate average attendance duration
  if (this.participants.length > 0) {
    const totalMinutes = this.participants.reduce((sum, p) => {
      return sum + (p.duration || 0);
    }, 0);
    this.averageAttendanceDuration = totalMinutes / this.participants.length;
  }
  
  return this.save();
};

module.exports = mongoose.model('Zoom', zoomSchema);
