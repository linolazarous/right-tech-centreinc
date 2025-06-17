const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const integrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Integration name is required'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-]+$/.test(v);
      },
      message: 'Name can only contain letters, numbers, spaces, and hyphens'
    }
  },
  description: {
    type: String,
    maxlength: [250, 'Description cannot exceed 250 characters'],
    trim: true
  },
  apiKey: {
    type: String,
    select: false, // Never return API key in queries by default
    set: function(value) {
      // Encrypt API key before storing
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-cbc', 
        Buffer.from(process.env.ENCRYPTION_KEY), 
        iv
      );
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${iv.toString('hex')}:${encrypted}`;
    },
    get: function(value) {
      if (!value) return value;
      const [iv, encrypted] = value.split(':');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc', 
        Buffer.from(process.env.ENCRYPTION_KEY), 
        Buffer.from(iv, 'hex')
      );
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['payment', 'analytics', 'communication', 'storage', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(config) {
        return Object.keys(config).length <= 20; // Limit config size
      },
      message: 'Config cannot have more than 20 properties'
    }
  },
  webhookUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['https'],
          require_protocol: true,
          require_valid_protocol: true
        });
      },
      message: 'Webhook URL must be a valid HTTPS URL'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  lastUsedAt: Date
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes
integrationSchema.index({ name: 1 });
integrationSchema.index({ serviceType: 1, isActive: 1 });
integrationSchema.index({ createdBy: 1 });
integrationSchema.index({ updatedAt: -1 });

// Middleware to update timestamps
integrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for masked API key (for display purposes)
integrationSchema.virtual('maskedApiKey').get(function() {
  if (!this.apiKey) return null;
  const visibleChars = 4;
  const masked = '*'.repeat(Math.max(0, this.apiKey.length - visibleChars));
  return this.apiKey.substring(0, visibleChars) + masked;
});

// Static method for service type validation
integrationSchema.statics.getValidServiceTypes = function() {
  return this.schema.path('serviceType').enumValues;
};

module.exports = mongoose.model('Integration', integrationSchema);
