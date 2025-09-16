import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // Basic User Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // URL to the user's profile picture
  bio: { type: String }, // Short bio or description

  // Authentication and Roles
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  isVerified: { type: Boolean, default: false }, // Email verification status
  verificationToken: { type: String }, // Token for email verification

  // Social Media Links
  socialMedia: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
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
  jobTitle: { type: String },
  company: { type: String },
  skills: [{ type: String }], // List of skills

  // Two-Factor Authentication
  twoFAEnabled: {
    type: Boolean,
    default: false
  },
  twoFASecret: {
    type: String,
    select: false // Don't include in queries by default
  }

}, {
  timestamps: true
});

// Update the `updatedAt` field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Add method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export as default
export default mongoose.model('User', userSchema);
