import mongoose from 'mongoose';

const resumeBuilderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
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
    timestamps: true,
    strict: true,
    minimize: false,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

resumeBuilderSchema.index({ createdAt: -1 });
resumeBuilderSchema.index({ 'metadata.lastGenerated': -1 });
resumeBuilderSchema.index({ userId: 1, 'metadata.version': -1 });

resumeBuilderSchema.query.byUserId = function(userId) {
  return this.where({ userId }).lean();
};

resumeBuilderSchema.query.latestVersion = function() {
  return this.sort({ 'metadata.version': -1 }).limit(1);
};

resumeBuilderSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.metadata.version += 1;
    this.metadata.lastGenerated = new Date();
  }
  next();
});

resumeBuilderSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Resume saved - User: ${doc.userId}, Size: ${JSON.stringify(doc.content).length} bytes`);
});

resumeBuilderSchema.post('find', function(docs) {
  console.log(`[DO Monitoring] Resume query returned ${docs.length} documents`);
});

export default mongoose.model('ResumeBuilder', resumeBuilderSchema);
