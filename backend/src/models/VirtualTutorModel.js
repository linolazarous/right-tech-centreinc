const mongoose = require('mongoose');

const virtualTutorSchema = new mongoose.Schema({
  // Core Information
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
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  tutorUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },

  // Tutor Metadata
  tutorType: {
    type: String,
    enum: ['ai', 'video', 'interactive', 'hybrid'],
    required: true,
    default: 'interactive'
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'zh'] // Extend as needed
  },
  subjects: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  // Access Control
  accessLevel: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Usage Analytics
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  usageCount: {
    type: Number,
    default: 0
  },

  // Relationships
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
virtualTutorSchema.index({ subjects: 1 });
virtualTutorSchema.index({ skillLevel: 1 });
virtualTutorSchema.index({ tutorType: 1 });
virtualTutorSchema.index({ accessLevel: 1 });
virtualTutorSchema.index({ averageRating: -1 });
virtualTutorSchema.index({ title: 'text', description: 'text' });

// Pre-save hooks
virtualTutorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Ensure URL has proper protocol
  if (this.isModified('tutorUrl') && !this.tutorUrl.startsWith('http')) {
    this.tutorUrl = `https://${this.tutorUrl}`;
  }
  
  // Normalize subjects
  if (this.isModified('subjects')) {
    this.subjects = this.subjects.map(subj => subj.trim().toLowerCase());
  }
  
  next();
});

// Virtual for tutor duration (example)
virtualTutorSchema.virtual('durationInMinutes').get(function() {
  // Add your duration calculation logic here
  return 30; // Default value
});

// Static methods
virtualTutorSchema.statics.findBySubject = function(subject) {
  return this.find({ subjects: subject.toLowerCase() });
};

virtualTutorSchema.statics.findPremiumTutors = function() {
  return this.find({ accessLevel: 'premium', isActive: true })
             .sort({ averageRating: -1 });
};

// Instance method
virtualTutorSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

module.exports = mongoose.model('VirtualTutor', virtualTutorSchema);
