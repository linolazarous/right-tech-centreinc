import mongoose from 'mongoose';

const gamificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    unique: true // Ensures one gamification record per user
  },
  points: { 
    type: Number, 
    default: 0,
    min: [0, 'Points cannot be negative'],
    max: [1000000, 'Points exceed maximum limit'] // Prevent integer overflow
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Badge',
    validate: {
      validator: function(badges) {
        return badges.length <= 50; // Limit number of badges
      },
      message: 'Cannot have more than 50 badges'
    }
  }],
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastUpdated: { type: Date }
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v; // Remove version key from output
      return ret;
    }
  }
});

// Compound index for common queries
gamificationSchema.index({ userId: 1, points: -1 });
gamificationSchema.index({ points: -1 });
gamificationSchema.index({ level: -1, points: -1 });

// Virtual property for rank (can be calculated based on points/level)
gamificationSchema.virtual('rank').get(function() {
  if (this.points < 100) return 'Novice';
  if (this.points < 1000) return 'Contributor';
  if (this.points < 5000) return 'Expert';
  return 'Master';
});

// Update streak logic
gamificationSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastUpdated = this.streak.lastUpdated || new Date(0);
  const dayDiff = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

  if (dayDiff === 1) {
    this.streak.current += 1;
    if (this.streak.current > this.streak.longest) {
      this.streak.longest = this.streak.current;
    }
  } else if (dayDiff > 1) {
    this.streak.current = 1; // Reset streak if broken
  }

  this.streak.lastUpdated = now;
  return this;
};

// Pre-save hook to ensure data consistency
gamificationSchema.pre('save', function(next) {
  // Auto-level up based on points
  this.level = Math.min(Math.floor(this.points / 1000) + 1, 100);
  this.lastActivityAt = new Date();
  next();
});

const Gamification = mongoose.model('Gamification', gamificationSchema);

export default Gamification;
