const mongoose = require('mongoose');
const validator = require('validator');

const certificateSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: [true, 'Course ID is required'],
    index: true
  },
  certificateNumber: {
    type: String,
    required: [true, 'Certificate number is required'],
    unique: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^CERT-[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/.test(v);
      },
      message: 'Invalid certificate number format'
    }
  },
  issuedDate: { 
    type: Date, 
    default: Date.now,
    immutable: true,
    index: true
  },
  expirationDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > this.issuedDate;
      },
      message: 'Expiration date must be after issued date'
    },
    index: true
  },
  certificateUrl: { 
    type: String,
    required: [true, 'Certificate URL is required'],
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid certificate URL'
    }
  },
  verificationUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
          allow_underscores: true
        });
      },
      message: 'Invalid verification URL'
    }
  },
  certificateType: {
    type: String,
    enum: ['completion', 'achievement', 'participation', 'excellence'],
    default: 'completion',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
    index: true
  },
  issuerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Issuer ID is required']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  digitalSignature: {
    type: String,
    select: false
  },
  blockchainTransactionHash: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional
        return /^0x([A-Fa-f0-9]{64})$/.test(v) || /^[A-Fa-f0-9]{64}$/.test(v);
      },
      message: 'Invalid blockchain transaction hash'
    }
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
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.digitalSignature;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from object output
      delete ret.digitalSignature;
      return ret;
    }
  }
});

// Compound indexes for optimized queries
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
certificateSchema.index({ userId: 1, status: 1 });
certificateSchema.index({ courseId: 1, issuedDate: -1 });
certificateSchema.index({ certificateType: 1, status: 1 });

// Pre-save hook to update status if expired
certificateSchema.pre('save', function(next) {
  if (this.expirationDate && this.expirationDate < new Date()) {
    this.status = 'expired';
  }
  this.updatedAt = new Date();
  next();
});

// Virtual properties
certificateSchema.virtual('isExpired').get(function() {
  return this.expirationDate && this.expirationDate < new Date();
});

certificateSchema.virtual('isVerified').get(function() {
  return !!this.blockchainTransactionHash || !!this.digitalSignature;
});

// Static methods
certificateSchema.statics.getUserCertificates = function(userId, options = {}) {
  const query = { userId };
  if (options.activeOnly) query.status = 'active';
  
  return this.find(query)
    .sort({ issuedDate: -1 })
    .populate('courseId', 'title shortDescription');
};

certificateSchema.statics.verifyCertificate = async function(certificateNumber) {
  return this.findOne({ certificateNumber })
    .populate('userId', 'name email')
    .populate('courseId', 'title description')
    .populate('issuerId', 'name title');
};

certificateSchema.statics.revokeCertificate = async function(certificateNumber, reason) {
  return this.findOneAndUpdate(
    { certificateNumber, status: 'active' },
    { 
      status: 'revoked',
      'metadata.revocationReason': reason,
      updatedAt: new Date()
    },
    { new: true }
  );
};

// Instance methods
certificateSchema.methods.generateVerificationUrl = function() {
  const baseUrl = process.env.BASE_URL || 'https://yourplatform.com';
  this.verificationUrl = `${baseUrl}/verify/${this.certificateNumber}`;
  return this.save();
};

module.exports = mongoose.model('Certificate', certificateSchema);
