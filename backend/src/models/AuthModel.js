import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Constants for security parameters
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes
const PASSWORD_RESET_EXPIRATION = 10 * 60 * 1000; // 10 minutes
const EMAIL_VERIFICATION_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const authSchema = new mongoose.Schema({
  email: {
  type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [12, 'Password must be at least 12 characters'],
    select: false,
    validate: {
      validator: function(p) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(p);
      },
      message: 'Password must contain at least one uppercase, one lowercase, one number and one special character'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'editor', 'api'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  lockUntil: {
    type: Date
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorRecoveryCodes: {
    type: [String],
    select: false
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  devices: [{
    deviceId: {
      type: String,
      required: true
    },
    userAgent: String,
    ipAddress: String,
    lastAccessed: Date,
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number]
    },
    trusted: {
      type: Boolean,
      default: false
    }
  }],
  securityQuestions: [{
    question: String,
    answer: {
      type: String,
      select: false
    }
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
  timestamps: false, // We're handling timestamps manually
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.password;
      delete ret.twoFactorSecret;
      delete ret.securityQuestions;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from object output
      delete ret.password;
      delete ret.twoFactorSecret;
      delete ret.securityQuestions;
      return ret;
    }
  }
});

// Indexes
authSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
authSchema.index({ role: 1 });
authSchema.index({ isVerified: 1 });
authSchema.index({ isActive: 1 });
authSchema.index({ 'devices.location': '2dsphere' });
authSchema.index({ updatedAt: 1 });

// Middleware to hash password before saving
authSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after
    next();
  } catch (err) {
    next(new Error('Error hashing password'));
  }
});

// Update the updatedAt field before saving
authSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Query middleware to exclude locked accounts by default
authSchema.pre(/^find/, function(next) {
  this.where({ 
    $or: [
      { lockUntil: { $exists: false } },
      { lockUntil: { $lte: new Date() } }
    ]
  });
  next();
});

// Instance method to check password
authSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after token was issued
authSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create JWT token
authSchema.methods.createAuthToken = function() {
  const payload = {
    id: this._id,
    role: this.role,
    isVerified: this.isVerified,
    twoFactorEnabled: this.twoFactorEnabled,
    twoFactorVerified: false // Will be set to true after 2FA verification
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: 'HS256'
    }
  );
};

// Instance method to create verified JWT token (after 2FA)
authSchema.methods.createVerifiedAuthToken = function() {
  const payload = {
    id: this._id,
    role: this.role,
    isVerified: this.isVerified,
    twoFactorEnabled: this.twoFactorEnabled,
    twoFactorVerified: true
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: 'HS256'
    }
  );
};

// Instance method to create refresh token
authSchema.methods.createRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256'
    }
  );
};

// Instance method to create password reset token
authSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + PASSWORD_RESET_EXPIRATION;

  return resetToken;
};

// Instance method to create email verification token
authSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpires = Date.now() + EMAIL_VERIFICATION_EXPIRATION;

  return verificationToken;
};

// Instance method to generate 2FA recovery codes
authSchema.methods.generateTwoFactorRecoveryCodes = function() {
  const codes = Array(10).fill().map(() => crypto.randomBytes(4).toString('hex'));
  this.twoFactorRecoveryCodes = codes.map(code => 
    crypto.createHash('sha256').update(code).digest('hex')
  );
  return codes;
};

// Static method to find by credentials (for login)
authSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email })
    .select('+password +isActive +loginAttempts +lockUntil +twoFactorEnabled +twoFactorSecret');

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials or account inactive');
  }

  // Check if account is temporarily locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
    throw new Error(`Account temporarily locked. Try again in ${remainingTime} minutes`);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
  // Increment login attempts
    user.loginAttempts += 1;
    
    // Lock account after MAX_LOGIN_ATTEMPTS failed attempts
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
      await user.save();
      throw new Error(`Account locked due to too many failed attempts. Try again in ${LOCK_TIME/60000} minutes`);
    }

    await user.save();
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Static method for rate limiting checks
authSchema.statics.checkRateLimit = async function(email, ip) {
  // Implement your rate limiting logic here
  // Could integrate with Redis for distributed rate limiting
  return true;
};

// Virtual for whether account is locked
authSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > Date.now();
});

// Virtual for user status
authSchema.virtual('status').get(function() {
  if (!this.isActive) return 'Disabled';
  if (this.isLocked) return 'Temporarily Locked';
  if (!this.isVerified) return 'Unverified';
  return 'Active';
});

const Auth = mongoose.model('Auth', authSchema);

export default Auth;
