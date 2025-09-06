import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Forum title is required'],
    maxlength: [120, 'Forum title cannot exceed 120 characters'],
    trim: true
  },
  description: { 
    type: String, 
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator ID is required'] 
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false, // We're manually handling createdAt/updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
forumSchema.index({ title: 'text' });
forumSchema.index({ createdBy: 1 });
forumSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
forumSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Forum = mongoose.model('Forum', forumSchema);

export default Forum;
