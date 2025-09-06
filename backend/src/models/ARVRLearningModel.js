import mongoose from 'mongoose';

const arVrLearningSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  arVrContentUrl: { 
    type: String, 
    required: [true, 'AR/VR content URL is required'],
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  contentType: {
    type: String,
    enum: ['3d-model', '360-video', 'ar-experience', 'vr-experience'],
    default: 'vr-experience'
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  duration: {
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
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
  timestamps: true, // This will auto-manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
arVrLearningSchema.index({ title: 'text', description: 'text' });
arVrLearningSchema.index({ isActive: 1 });
arVrLearningSchema.index({ tags: 1 });

// Pre-save hook to update the updatedAt field
arVrLearningSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property for content status
arVrLearningSchema.virtual('status').get(function() {
  return this.isActive ? 'Active' : 'Inactive';
});

const ARVRLearning = mongoose.model('ARVRLearning', arVrLearningSchema);

export default ARVRLearning;
