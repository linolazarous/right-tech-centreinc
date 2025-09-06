import mongoose from 'mongoose';
import validator from 'validator';

const adSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Ad title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    minlength: [5, 'Title must be at least 5 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    required: function() {
      return !this.imageUrl; // Description required if no image
    }
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http','https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http','https'],
        require_protocol: true
      }),
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  targetAudience: {
    type: [String],
    enum: {
      values: ['all', 'students', 'professionals', 'developers', 'designers', 'educators', 'enterprise'],
      message: 'Invalid audience type'
    },
    default: ['all'],
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one target audience is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v) {
        return !this.endDate || v <= this.endDate;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return v >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  ctr: { // Click-through rate (virtual in schema, stored in DB)
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  budget: { // In USD cents (100 = $1.00)
    type: Number,
    min: 0,
    max: 1000000 // $10,000 max budget
  },
  spend: { // Amount spent so far
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true },
  collation: { locale: 'en', strength: 2 } // Case-insensitive
});

// ==============================================
// Indexes for Performance
// ==============================================
adSchema.index({ title: 'text', description: 'text' });
adSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
adSchema.index({ targetAudience: 1 });
adSchema.index({ clicks: -1 });
adSchema.index({ impressions: -1 });

// ==============================================
// Virtual Properties
// ==============================================
adSchema.virtual('isLive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         (!this.endDate || this.endDate >= now);
});

adSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const now = new Date();
  return Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
});

// ==============================================
// Middleware
// ==============================================
adSchema.pre('save', function(next) {
  // Calculate CTR before saving
  if (this.isModified('clicks') || this.isModified('impressions')) {
    this.ctr = this.impressions > 0 
      ? Math.round((this.clicks / this.impressions) * 100 * 100) / 100 
      : 0;
  }

  // Handle image URLs for different storage providers
  if (this.imageUrl && !this.imageUrl.startsWith('http')) {
    if (process.env.STORAGE_PROVIDER === 'digitalocean') {
      this.imageUrl = `${process.env.DO_SPACES_URL}/${this.imageUrl}`;
    } else if (process.env.STORAGE_PROVIDER === 'cloudinary') {
      this.imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${this.imageUrl}`;
    }
  }
  
  next();
});

// ==============================================
// Static Methods
// ==============================================
adSchema.statics = {
  async getActiveAds(audience = 'all') {
    const now = new Date();
    return this.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: null },
        { endDate: { $gte: now } }
      ],
      targetAudience: { $in: ['all', audience] }
    }).sort({ impressions: 1 }); // Show less-impressed ads first
  },

  async incrementMetrics(adId, field, value = 1) {
    return this.findByIdAndUpdate(
      adId,
      { $inc: { [field]: value } },
      { new: true }
    );
  },

  async getAdsByPerformance(minCTR = 1, minImpressions = 100) {
    return this.aggregate([
      {
        $match: {
          impressions: { $gte: minImpressions },
          $expr: { $gte: [{ $multiply: [{$divide: ["$clicks", "$impressions"]}, 100] }, minCTR } 
        }
      },
      { $sort: { ctr: -1 } },
      { $limit: 50 }
    ]);
  }
};

// ==============================================
// Instance Methods
// ==============================================
adSchema.methods = {
  incrementClicks() {
    this.clicks += 1;
    return this.save();
  },

  incrementImpressions() {
    this.impressions += 1;
    return this.save();
  },

  trackView() {
    this.impressions += 1;
    if (this.budget) {
      // Deduct $0.001 per impression (CPM model)
      this.spend = Math.min(this.spend + 0.1, this.budget);
      if (this.spend >= this.budget) {
        this.isActive = false;
      }
    }
    return this.save();
  },

  trackClick() {
    this.clicks += 1;
    if (this.budget) {
      // Deduct $0.02 per click (PPC model)
      this.spend = Math.min(this.spend + 2, this.budget);
      if (this.spend >= this.budget) {
        this.isActive = false;
      }
    }
    return this.save();
  }
};

// ==============================================
// Query Helpers
// ==============================================
adSchema.query.active = function() {
  const now = new Date();
  return this.where({ 
    isActive: true,
    startDate: { $lte: now },
    $or: [
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  });
};

adSchema.query.byAudience = function(audience) {
  return this.where({ 
    targetAudience: { $in: ['all', audience] } 
  });
};

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
