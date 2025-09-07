import mongoose from 'mongoose';

const vrCareerFairSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  fairUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC',
    enum: Intl.supportedValuesOf('timeZone')
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participatingCompanies: [{
    name: { type: String, required: true },
    logo: String,
    description: String,
    boothLocation: String
  }],
  schedule: [{
    time: { type: Date, required: true },
    title: { type: String, required: true },
    description: String,
    speaker: String
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  registrationRequired: {
    type: Boolean,
    default: true
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  accessLevel: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  registeredAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

vrCareerFairSchema.index({ startDate: 1, endDate: 1 });
vrCareerFairSchema.index({ tags: 1 });
vrCareerFairSchema.index({ 'participatingCompanies.name': 'text' });
vrCareerFairSchema.index({ title: 'text', description: 'text' });

vrCareerFairSchema.virtual('durationHours').get(function() {
  return (this.endDate - this.startDate) / (1000 * 60 * 60);
});

vrCareerFairSchema.virtual('isLive').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

vrCareerFairSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isModified('fairUrl') && !this.fairUrl.startsWith('http')) {
    this.fairUrl = `https://${this.fairUrl}`;
  }
  
  if (this.isModified('tags')) {
    this.tags = this.tags.map(tag => tag.trim().toLowerCase());
  }
  
  const now = new Date();
  if (now > this.endDate) {
    this.status = 'completed';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'live';
  }
  
  next();
});

vrCareerFairSchema.statics.findUpcomingFairs = function() {
  return this.find({ 
    startDate: { $gt: new Date() },
    status: { $ne: 'cancelled' }
  }).sort({ startDate: 1 });
};

vrCareerFairSchema.statics.findLiveFairs = function() {
  return this.find({ status: 'live' });
};

vrCareerFairSchema.methods.registerAttendee = function(userId) {
  if (!this.registeredAttendees.includes(userId)) {
    this.registeredAttendees.push(userId);
  }
  return this.save();
};

vrCareerFairSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('VRCareerFair', vrCareerFairSchema);
