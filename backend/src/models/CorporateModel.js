const mongoose = require('mongoose');
const validator = require('validator');

const corporateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters'],
    index: true
  },
  legalName: {
    type: String,
    trim: true,
    maxlength: [150, 'Legal name cannot exceed 150 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [250, 'Short description cannot exceed 250 characters']
  },
  contactEmail: { 
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
    index: true
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isMobilePhone(v, 'any', { strictMode: false });
      },
      message: 'Please provide a valid phone number'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'Please provide a valid website URL'
    }
  },
  logoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid logo URL'
    }
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'technology', 'finance', 'healthcare', 'education', 
      'manufacturing', 'retail', 'hospitality', 'other'
    ],
    index: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    index: true
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  headquarters: {
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  taxId: {
    type: String,
    select: false // Sensitive information
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true
  },
  billingInfo: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    billingEmail: String,
    paymentMethodId: {
      type: String,
      select: false
    },
    nextBillingDate: Date
  },
  adminUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.taxId;
      delete ret.billingInfo.paymentMethodId;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from object output
      delete ret.taxId;
      delete ret.billingInfo.paymentMethodId;
      return ret;
    }
  }
});

// Indexes for optimized queries
corporateSchema.index({ name: 'text', description: 'text' });
corporateSchema.index({ 'headquarters.coordinates': '2dsphere' });
corporateSchema.index({ industry: 1, size: 1 });
corporateSchema.index({ status: 1, isVerified: 1 });
corporateSchema.index({ 'billingInfo.plan': 1 });

// Pre-save hook to update timestamps
corporateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual properties
corporateSchema.virtual('yearsInOperation').get(function() {
  if (!this.foundedYear) return null;
  return new Date().getFullYear() - this.foundedYear;
});

corporateSchema.virtual('formattedAddress').get(function() {
  if (!this.headquarters.address) return null;
  return `${this.headquarters.address}, ${this.headquarters.city}, ${this.headquarters.state} ${this.headquarters.postalCode}, ${this.headquarters.country}`;
});

// Static methods
corporateSchema.statics.getVerifiedCompanies = function() {
  return this.find({ 
    isVerified: true,
    status: 'active'
  }).sort({ name: 1 });
};

corporateSchema.statics.searchByLocation = function(longitude, latitude, radiusKm = 10) {
  return this.find({
    'headquarters.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    },
    status: 'active'
  });
};

corporateSchema.statics.upgradePlan = async function(companyId, newPlan) {
  return this.findByIdAndUpdate(
    companyId,
    { 
      'billingInfo.plan': newPlan,
      'billingInfo.nextBillingDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    { new: true }
  );
};

// Instance methods
corporateSchema.methods.verifyCompany = function() {
  this.isVerified = true;
  return this.save();
};

corporateSchema.methods.addAdmin = function(userId) {
  if (!this.adminUsers.includes(userId)) {
    this.adminUsers.push(userId);
  }
  return this.save();
};

module.exports = mongoose.model('Corporate', corporateSchema);
