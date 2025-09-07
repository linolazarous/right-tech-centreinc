import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  recommendedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Recommended item ID is required'],
    index: true
  },
  itemType: {
    type: String,
    required: [true, 'Item type is required'],
    enum: {
      values: ['course', 'article', 'product', 'service', 'user', 'event'],
      message: '{VALUE} is not a valid recommendation type'
    },
    index: true
  },
  algorithm: {
    type: String,
    required: [true, 'Algorithm identifier is required'],
    enum: [
      'collaborative_filtering',
      'content_based',
      'hybrid',
      'popularity',
      'neural_network',
      'knowledge_based'
    ]
  },
  score: {
    type: Number,
    required: [true, 'Recommendation score is required'],
    min: [0, 'Score cannot be negative'],
    max: [1, 'Score cannot exceed 1']
  },
  confidence: {
    type: Number,
    min: [0, 'Confidence cannot be negative'],
    max: [1, 'Confidence cannot exceed 1']
  },
  rank: {
    type: Number,
    min: [1, 'Rank must be at least 1']
  },
  context: {
    platform: {
      type: String,
      enum: ['web', 'mobile', 'email', 'api'],
      default: 'web'
    },
    location: String,
    device: String,
    timeOfDay: Number,
    dayOfWeek: Number
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  conversions: {
    type: Number,
    default: 0,
    min: 0
  },
  lastShownAt: {
    type: Date
  },
  dismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: {
    type: Date
  },
  explanation: {
    type: String,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  features: {
    type: Map,
    of: Number
  },
  metadata: {
    type: Object,
    default: {}
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
  expiresAt: {
    type: Date,
    index: true,
    validate: {
      validator: function(v) {
        return !v || v > this.createdAt;
      },
      message: 'Expiration must be after creation time'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

recommendationSchema.index({ userId: 1, itemType: 1 });
recommendationSchema.index({ itemType: 1, score: -1 });
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ algorithm: 1, score: -1 });
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

recommendationSchema.pre('save', function(next) {
  if (this.isModified('score') && this.score < 0.1) {
    this.dismissed = true;
    this.dismissedAt = new Date();
  }
  next();
});

recommendationSchema.statics.findForUser = async function(userId, options = {}) {
  const { 
    limit = 10, 
    itemType, 
    minScore = 0.3,
    excludeDismissed = true 
  } = options;

  try {
    const query = {
      userId,
      score: { $gte: minScore },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    if (itemType) query.itemType = itemType;
    if (excludeDismissed) query.dismissed = false;

    return await this.find(query)
      .sort({ score: -1, rank: 1 })
      .limit(limit);
  } catch (error) {
    console.error(`Error finding recommendations for user ${userId}:`, error);
    throw error;
  }
};

recommendationSchema.statics.recordInteraction = async function(recommendationId, action) {
  try {
    const update = { $inc: {} };
    
    if (action === 'impression') {
      update.$inc.impressions = 1;
      update.lastShownAt = new Date();
    } else if (action === 'click') {
      update.$inc.clicks = 1;
    } else if (action === 'conversion') {
      update.$inc.conversions = 1;
    }

    return await this.findByIdAndUpdate(
      recommendationId,
      update,
      { new: true }
    );
  } catch (error) {
    console.error(`Error recording interaction for recommendation ${recommendationId}:`, error);
    throw error;
  }
};

recommendationSchema.methods.dismiss = async function() {
  try {
    this.dismissed = true;
    this.dismissedAt = new Date();
    return await this.save();
  } catch (error) {
    console.error(`Error dismissing recommendation ${this._id}:`, error);
    throw error;
  }
};

recommendationSchema.methods.calculateCTR = function() {
  return this.impressions > 0 ? (this.clicks / this.impressions) : 0;
};

recommendationSchema.virtual('isActive').get(function() {
  return !this.dismissed && (!this.expiresAt || this.expiresAt > new Date());
});

recommendationSchema.virtual('effectivenessScore').get(function() {
  const ctr = this.calculateCTR();
  const conversionRate = this.impressions > 0 ? (this.conversions / this.impressions) : 0;
  return (this.score * 0.6) + (ctr * 0.3) + (conversionRate * 0.1);
});

export default mongoose.model('Recommendation', recommendationSchema);
