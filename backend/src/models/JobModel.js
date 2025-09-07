import mongoose from 'mongoose';
import validator from 'validator';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [120, 'Job title cannot exceed 120 characters'],
    text: true // Enable text search
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
    default: ''
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [80, 'Company name cannot exceed 80 characters'],
    text: true
  },
  companyLogo: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid logo URL'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    text: true
  },
  remotePolicy: {
    type: String,
    enum: ['on-site', 'hybrid', 'remote', 'flexible'],
    default: 'on-site'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: [true, 'Job type is required']
  },
  salaryRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, maxlength: 3 }
  },
  skillsRequired: [{
    type: String,
    trim: true,
    maxlength: [40, 'Skill cannot exceed 40 characters']
  }],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: [true, 'Experience level is required']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Poster ID is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'archived'],
    default: 'draft',
    index: true
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  applicationUrl: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid application URL'
    }
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  applications: {
    type: Number,
    default: 0,
    min: 0
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
  publishedAt: Date,
  closedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: false // We're managing updatedAt manually
});

// Indexes for optimized queries
jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });
jobSchema.index({ status: 1, experienceLevel: 1 });
jobSchema.index({ 'salaryRange.min': 1, 'salaryRange.max': 1 });
jobSchema.index({ postedBy: 1, status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ applicationDeadline: 1 });

// Text search weights
jobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  location: 'text',
  skillsRequired: 'text'
}, {
  weights: {
    title: 10,
    skillsRequired: 8,
    company: 5,
    location: 3,
    description: 1
  },
  name: 'job_text_search'
});

// Virtuals
jobSchema.virtual('isActive').get(function() {
  return this.status === 'published' && 
         (!this.applicationDeadline || this.applicationDeadline > new Date());
});

jobSchema.virtual('daysSincePosted').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Hooks
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Set closedAt when status changes to closed
  if (this.isModified('status') && this.status === 'closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  
  // Generate short description if empty
  if (!this.shortDescription) {
    this.shortDescription = this.description.substring(0, 200).replace(/\n/g, ' ').trim();
  }
  
  next();
});

// Static methods
jobSchema.statics.getActiveJobs = function() {
  return this.find({ 
    status: 'published',
    $or: [
      { applicationDeadline: { $exists: false } },
      { applicationDeadline: { $gt: new Date() } }
    ]
  });
};

// Instance methods
jobSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

jobSchema.methods.incrementApplications = async function() {
  this.applications += 1;
  return this.save();
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
