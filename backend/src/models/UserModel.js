// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Changed from 'bcrypt' to 'bcryptjs'

const userSchema = new mongoose.Schema({
  // Basic User Information
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    select: false // Hides password in queries by default
  },
  profilePicture: { type: String },
  bio: { type: String, trim: true },

  // Authentication and Roles
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'deleted'], 
    default: 'active' 
  },

  // Social Media Links
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
  },

  // Learning Progress
  enrolledCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  completedCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  badges: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Badge' 
  }],

  // Career Information
  jobTitle: { type: String, trim: true },
  company: { type: String, trim: true },
  skills: [{ type: String, trim: true }],

  // Two-Factor Authentication
  twoFAEnabled: { type: Boolean, default: false },
  twoFASecret: { type: String, select: false },

  // Timestamps and Login Info
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
}, {
  timestamps: true // This option automatically adds createdAt and updatedAt
});

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'socialMedia.github': 1 });
userSchema.index({ status: 1 });

// Hash the password before saving a new or updated user
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash the password with a salt round of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update the `updatedAt` field on save and sanitize data
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  
  // Data Sanitization
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('firstName')) this.firstName = this.firstName.trim();
  if (this.isModified('lastName')) this.lastName = this.lastName.trim();
  
  next();
});

// Add method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
