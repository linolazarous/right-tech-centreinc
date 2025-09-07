import mongoose from 'mongoose';

const vrLabSchema = new mongoose.Schema({
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
  labUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  vrEnvironment: {
    type: String,
    enum: ['webxr', 'unity', 'unreal', 'custom'],
    required: true,
    default: 'webxr'
  },
  supportedDevices: [{
    type: String,
    enum: ['oculus-quest', 'htc-vive', 'valve-index', 'web-browser', 'mobile-ar'],
    required: true
  }],
  requiredBandwidth: {
    type: Number,
    min: 1,
    default: 10
  },
  learningObjectives: [{
    type: String,
    trim: true,
    maxlength: [200, 'Objective cannot exceed 200 characters']
  }],
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedDuration: {
    type: Number,
    min: 1,
    default: 30
  },
  subjects: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  accessType: {
    type: String,
    enum: ['public', 'restricted', 'licensed'],
    default: 'public'
  },
  licenseKey: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastAccessed: {
    type: Date
  },
  accessCount: {
    type: Number,
    default: 0
  },
  relatedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VRLab'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

vrLabSchema.index({ subjects: 1 });
vrLabSchema.index({ difficultyLevel: 1 });
vrLabSchema.index({ vrEnvironment: 1 });
vrLabSchema.index({ accessType: 1 });
vrLabSchema.index({ title: 'text', description: 'text' });
vrLabSchema.index({ 'learningObjectives': 'text' });

vrLabSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isModified('labUrl') && !this.labUrl.startsWith('http')) {
    this.labUrl = `https://${this.labUrl}`;
  }
  if (this.isModified('thumbnailUrl') && this.thumbnailUrl && !this.thumbnailUrl.startsWith('http')) {
    this.thumbnailUrl = `https://${this.thumbnailUrl}`;
  }
  
  if (this.isModified('subjects')) {
    this.subjects = this.subjects.map(subj => subj.trim().toLowerCase());
  }
  
  next();
});

vrLabSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.estimatedDuration / 60);
  const minutes = this.estimatedDuration % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
});

vrLabSchema.statics.findByDevice = function(device) {
  return this.find({ supportedDevices: device, isActive: true });
};

vrLabSchema.statics.findBySubject = function(subject) {
  return this.find({ 
    subjects: subject.toLowerCase(),
    isActive: true 
  });
};

vrLabSchema.methods.recordAccess = function() {
  this.accessCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

vrLabSchema.methods.checkCompatibility = function(userDevice) {
  return this.supportedDevices.includes(userDevice);
};

export default mongoose.model('VRLab', vrLabSchema);
