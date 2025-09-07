import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    select: false
  },
  profilePicture: { type: String },
  bio: { type: String, trim: true },
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
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
  },
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
  jobTitle: { type: String, trim: true },
  company: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'socialMedia.github': 1 });
userSchema.index({ status: 1 });

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('firstName')) this.firstName = this.firstName.trim();
  if (this.isModified('lastName')) this.lastName = this.lastName.trim();
  
  next();
});

export default mongoose.model('User', userSchema);
