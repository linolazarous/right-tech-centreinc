import mongoose from 'mongoose';

const jobMatchingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: [true, 'Job ID is required'],
    index: true
  },
  matchScore: { 
    type: Number,
    required: true,
    min: [0, 'Match score cannot be negative'],
    max: [100, 'Match score cannot exceed 100'],
    set: v => parseFloat(v.toFixed(2)) // Store with 2 decimal places
  },
  scoreComponents: {
    skills: { type: Number, min: 0, max: 40 },
    experience: { type: Number, min: 0, max: 30 },
    location: { type: Number, min: 0, max: 15 },
    preferences: { type: Number, min: 0, max: 15 }
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'applied', 'rejected', 'shortlisted'],
    default: 'pending',
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  viewedAt: Date,
  appliedAt: Date,
  feedback: {
    employer: String,
    candidate: String
  },
  matchingAlgorithmVersion: {
    type: String,
    required: true,
    default: '1.0'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common query patterns
jobMatchingSchema.index({ userId: 1, matchScore: -1 });
jobMatchingSchema.index({ jobId: 1, matchScore: -1 });
jobMatchingSchema.index({ matchScore: -1, createdAt: -1 });
jobMatchingSchema.index({ status: 1, lastUpdated: -1 });

// Unique compound index to prevent duplicate matches
jobMatchingSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// Virtual for match quality categorization
jobMatchingSchema.virtual('matchQuality').get(function() {
  if (this.matchScore >= 85) return 'excellent';
  if (this.matchScore >= 70) return 'good';
  if (this.matchScore >= 50) return 'fair';
  return 'poor';
});

// Pre-save hook to update timestamps and validate score components
jobMatchingSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  
  // Calculate total match score if components exist
  if (this.scoreComponents && this.isModified('scoreComponents')) {
    const components = this.scoreComponents;
    this.matchScore = components.skills + components.experience + 
                     components.location + components.preferences;
  }
  
  // Update status timestamps
  if (this.isModified('status')) {
    if (this.status === 'viewed' && !this.viewedAt) {
      this.viewedAt = new Date();
    } else if (this.status === 'applied' && !this.appliedAt) {
      this.appliedAt = new Date();
    }
  }
  
  next();
});

// Static method for bulk matching operations
jobMatchingSchema.statics.bulkCreateMatches = async function(matches) {
  try {
    return await this.insertMany(matches, { ordered: false });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors gracefully
      console.warn('Some duplicate matches were skipped');
      return error.ops;
    }
    throw error;
  }
};

// Query helper for filtering by match quality
jobMatchingSchema.query.byQuality = function(quality) {
  const ranges = {
    excellent: { $gte: 85 },
    good: { $gte: 70, $lt: 85 },
    fair: { $gte: 50, $lt: 70 },
    poor: { $lt: 50 }
  };
  return this.where('matchScore', ranges[quality] || { $gte: 0 });
};

const JobMatching = mongoose.model('JobMatching', jobMatchingSchema);

export default JobMatching;
