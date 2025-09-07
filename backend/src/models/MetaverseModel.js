import mongoose from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

const metaverseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    minlength: [5, 'Title must be at least 5 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  virtualWorldUrl: {
    type: String,
    required: [true, 'Virtual world URL is required'],
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true
        });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  featuredImageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  category: {
    type: String,
    enum: ['social', 'gaming', 'education', 'business', 'entertainment', 'other'],
    default: 'social'
  },
  accessType: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  supportedPlatforms: {
    type: [String],
    enum: ['web', 'windows', 'mac', 'linux', 'android', 'ios', 'vr'],
    default: ['web']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  visitCount: {
    type: Number,
    default: 0
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

metaverseSchema.index({ title: 'text', description: 'text', tags: 'text' });
metaverseSchema.index({ slug: 1 }, { unique: true });
metaverseSchema.index({ category: 1, isFeatured: 1 });
metaverseSchema.index({ owner: 1 });
metaverseSchema.index({ rating: -1 });
metaverseSchema.index({ visitCount: -1 });

metaverseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

metaverseSchema.statics.findBySlug = async function(slug) {
  try {
    return await this.findOne({ slug });
  } catch (error) {
    console.error(`Error finding metaverse by slug ${slug}:`, error);
    throw error;
  }
};

metaverseSchema.methods.incrementVisitCount = async function() {
  try {
    this.visitCount += 1;
    await this.save();
  } catch (error) {
    console.error(`Error incrementing visit count for ${this.slug}:`, error);
    throw error;
  }
};

metaverseSchema.virtual('formattedUrl').get(function() {
  return this.virtualWorldUrl.replace(/^https?:\/\//, '');
});

export default mongoose.model('Metaverse', metaverseSchema);
