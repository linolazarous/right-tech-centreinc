import mongoose from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

const AffiliationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Affiliation name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [2, 'Name must be at least 2 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-&.,()]+$/.test(v);
      },
      message: 'Name contains invalid characters'
    }
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'Must be a valid HTTP/HTTPS URL'
    }
  },
  contactEmail: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isEmail(v);
      },
      message: 'Must be a valid email address'
    }
  },
  contactPhone: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isMobilePhone(v);
      },
      message: 'Must be a valid phone number'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  socialMedia: {
    twitter: String,
    linkedin: String,
    facebook: String,
    instagram: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
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
AffiliationSchema.index({ name: 'text', description: 'text' });
AffiliationSchema.index({ slug: 1 });
AffiliationSchema.index({ isFeatured: 1, isActive: 1 });
AffiliationSchema.index({ 'location.coordinates': '2dsphere' });

// ==============================================
// Virtual Properties
// ==============================================
AffiliationSchema.virtual('memberCount').get(function() {
  return this.members?.length || 0;
});

AffiliationSchema.virtual('socialLinks').get(function() {
  return Object.entries(this.socialMedia || {})
    .filter(([_, value]) => value)
    .map(([platform, url]) => ({ platform, url }));
});

// ==============================================
// Middleware
// ==============================================
AffiliationSchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  // Handle logo URL for different storage providers
  if (this.logo && !this.logo.startsWith('http')) {
    if (process.env.STORAGE_PROVIDER === 'digitalocean') {
      this.logo = `${process.env.DO_SPACES_URL}/affiliations/${this.logo}`;
    } else if (process.env.STORAGE_PROVIDER === 'cloudinary') {
      this.logo = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${this.logo}`;
    }
  }
  
  next();
});

// ==============================================
// Static Methods
// ==============================================
AffiliationSchema.statics = {
  async search(query, limit = 10) {
    return this.find(
      {
        $text: { $search: query },
        isActive: true
      },
      {
        score: { $meta: 'textScore' }
      }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .lean();
  },

  async getFeaturedAffiliations(limit = 5) {
    return this.find({ 
      isFeatured: true,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  },

  async getNearbyAffiliations(coordinates, maxDistance = 5000) {
    return this.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      },
      isActive: true
    }).lean();
  },

  async getByMember(userId) {
    return this.find({ 
      members: userId,
      isActive: true 
    }).lean();
  }
};

// ==============================================
// Instance Methods
// ==============================================
AffiliationSchema.methods = {
  addMember(userId) {
    if (!this.members.some(member => member.equals(userId))) {
      this.members.push(userId);
    }
    return this.save();
  },

  removeMember(userId) {
    this.members = this.members.filter(
      member => !member.equals(userId)
    );
    return this.save();
  },

  async getSimilarAffiliations(limit = 3) {
    return this.constructor
      .find({
        _id: { $ne: this._id },
        'location.city': this.location?.city,
        isActive: true
      })
      .limit(limit)
      .lean();
  }
};

// ==============================================
// Query Helpers
// ==============================================
AffiliationSchema.query.active = function() {
  return this.where({ isActive: true });
};

AffiliationSchema.query.featured = function() {
  return this.where({ isFeatured: true });
};

AffiliationSchema.query.byLocation = function(city) {
  return this.where({ 'location.city': new RegExp(city, 'i') });
};

const Affiliation = mongoose.model('Affiliation', AffiliationSchema);

export default Affiliation;
