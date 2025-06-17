const mongoose = require('mongoose');

// Schema Definition
const resumeBuilderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Critical for DigitalOcean's query performance
    },
    template: {
      type: String,
      required: [true, 'Template type is required'],
      enum: {
        values: ['classic', 'modern', 'minimalist', 'executive'],
        message: 'Invalid template type'
      },
      default: 'modern'
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Resume content is required'],
      validate: {
        validator: function(v) {
          // Basic validation to ensure content structure
          return v && 
                 typeof v === 'object' && 
                 v.personalInfo && 
                 v.experience;
        },
        message: 'Invalid resume structure'
      },
      default: () => ({})
    },
    metadata: {
      pdfUrl: {
        type: String,
        validate: {
          validator: function(v) {
            // DigitalOcean Spaces URL validation
            return !v || /^https:\/\/[a-z0-9-]+\.nyc3\.digitaloceanspaces\.com\/.+/.test(v);
          },
          message: 'PDF URL must be a valid DigitalOcean Spaces URL'
        }
      },
      lastGenerated: Date,
      version: {
        type: Number,
        default: 1
      }
    }
  },
  {
    // DigitalOcean Optimization Flags
    timestamps: true, // Auto-manage createdAt and updatedAt
    strict: true, // Reject undefined fields
    minimize: false, // Store empty objects
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v; // Remove version key
        ret.id = ret._id; // Standardize ID field
        delete ret._id;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
resumeBuilderSchema.index({ createdAt: -1 }); // Sorting optimization
resumeBuilderSchema.index({ 'metadata.lastGenerated': -1 }); // For report generation
resumeBuilderSchema.index({ userId: 1, 'metadata.version': -1 }); // Version tracking

// Query Helpers for DigitalOcean's Connection Efficiency
resumeBuilderSchema.query.byUserId = function(userId) {
  return this.where({ userId }).lean(); // Lean for memory efficiency
};

resumeBuilderSchema.query.latestVersion = function() {
  return this.sort({ 'metadata.version': -1 }).limit(1);
};

// Middleware for DigitalOcean Spaces integration
resumeBuilderSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.metadata.version += 1;
    this.metadata.lastGenerated = new Date();
  }
  next();
});

// DigitalOcean Monitoring Hooks
resumeBuilderSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Resume saved - User: ${doc.userId}, Size: ${JSON.stringify(doc.content).length} bytes`);
});

resumeBuilderSchema.post('find', function(docs) {
  console.log(`[DO Monitoring] Resume query returned ${docs.length} documents`);
});

module.exports = mongoose.model('ResumeBuilder', resumeBuilderSchema);
