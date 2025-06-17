const mongoose = require('mongoose');

const virtualLabSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'archived'],
    default: 'active'
  },
  accessLevel: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  estimatedDuration: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
virtualLabSchema.index({ title: 'text', description: 'text' });
virtualLabSchema.index({ status: 1 });
virtualLabSchema.index({ accessLevel: 1 });
virtualLabSchema.index({ courseId: 1 });
virtualLabSchema.index({ tags: 1 });
virtualLabSchema.index({ createdBy: 1 });

// Pre-save hooks
virtualLabSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isModified('labUrl') && !this.labUrl.startsWith('http')) {
    this.labUrl = `https://${this.labUrl}`;
  }
  
  next();
});

// Optional: Add static methods for common queries
virtualLabSchema.statics.findByCourse = function(courseId) {
  return this.find({ courseId }).sort({ createdAt: -1 });
};

virtualLabSchema.statics.findPublicLabs = function() {
  return this.find({ accessLevel: 'public', status: 'active' });
};

module.exports = mongoose.model('VirtualLab', virtualLabSchema);
