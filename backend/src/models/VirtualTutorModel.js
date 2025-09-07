import mongoose from 'mongoose';

const virtualTutorSchema = new mongoose.Schema({
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
  tutorType: {
    type: String,
    enum: ['ai', 'video', 'interactive', 'hybrid'],
    required: true,
    default: 'interactive'
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'zh']
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
  accessLevel: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

virtualTutorSchema.index({ subjects: 1 });
virtualTutorSchema.index({ skillLevel: 1 });
virtualTutorSchema.index({ tutorType: 1 });
virtualTutorSchema.index({ accessLevel: 1 });
virtualTutorSchema.index({ averageRating: -1 });
virtualTutorSchema.index({ title: 'text', description: 'text' });

virtualTutorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isModified('tutorUrl') && !this.tutorUrl.startsWith('http')) {
    this.tutorUrl = `https://${this.tutorUrl}`;
  }
  
  if (this.isModified('subjects')) {
    this.subjects = this.subjects.map(subj => subj.trim().toLowerCase());
  }
  
  next();
});

virtualTutorSchema.virtual('durationInMinutes').get(function() {
  return 30;
});

virtualTutorSchema.statics.findBySubject = function(subject) {
  return this.find({ subjects: subject.toLowerCase() });
};

virtualTutorSchema.statics.findPremiumTutors = function() {
  return this.find({ accessLevel: 'premium', isActive: true })
             .sort({ averageRating: -1 });
};

virtualTutorSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

export default mongoose.model('VirtualTutor', virtualTutorSchema);
