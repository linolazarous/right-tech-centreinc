import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative'],
    set: v => Math.round(v) // Store as integer
  },
  weeklyScore: {
    type: Number,
    default: 0,
    min: 0
  },
  monthlyScore: {
    type: Number,
    default: 0,
    min: 0
  },
  rank: {
    type: Number,
    min: [1, 'Rank cannot be less than 1'],
    index: true
  },
  previousRank: {
    type: Number,
    min: 1
  },
  percentile: {
    type: Number,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    enum: ['global', 'regional', 'friends', 'company'],
    default: 'global',
    index: true
  },
  badges: [{
    type: String,
    enum: ['top10', 'top100', 'rising', 'streak', 'champion']
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  streak: {
    days: { type: Number, default: 0 },
    lastUpdated: { type: Date }
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for leaderboard queries
leaderboardSchema.index({ category: 1, score: -1 });
leaderboardSchema.index({ category: 1, weeklyScore: -1 });
leaderboardSchema.index({ category: 1, monthlyScore: -1 });
leaderboardSchema.index({ rank: 1, category: 1 });
leaderboardSchema.index({ userId: 1, category: 1 });

// Text index for badge searching
leaderboardSchema.index({ badges: 1 });

// Virtual for rank change direction
leaderboardSchema.virtual('rankChange').get(function() {
  if (!this.previousRank) return 'new';
  return this.rank < this.previousRank ? 'up' : 
         this.rank > this.previousRank ? 'down' : 'same';
});

// Virtual for streak status
leaderboardSchema.virtual('streakStatus').get(function() {
  if (!this.streak.lastUpdated) return 'inactive';
  const daysSince = Math.floor((new Date() - this.streak.lastUpdated) / (1000 * 60 * 60 * 24));
  return daysSince === 0 ? 'active' : 
         daysSince === 1 ? 'expiring' : 'broken';
});

// Pre-save hook for rank tracking and streak calculation
leaderboardSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Store previous rank if changing
  if (this.isModified('rank') && !this.isNew) {
    this.previousRank = this.constructor.previousRank || this.rank;
  }

  // Update streak if score increased
  if (this.isModified('score') && this.score > this.constructor.previousScore) {
    this.updateStreak();
  }

  next();
});

// Method to update user streak
leaderboardSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastUpdated = this.streak.lastUpdated || new Date(0);
  const dayDiff = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

  if (dayDiff === 1) {
    this.streak.days += 1;
  } else if (dayDiff > 1) {
    this.streak.days = 1; // Reset streak if broken
  } else if (!this.streak.lastUpdated) {
    this.streak.days = 1; // Initialize streak
  }

  this.streak.lastUpdated = now;
  this.checkBadges();
};

// Method to update badges based on performance
leaderboardSchema.methods.checkBadges = function() {
  const newBadges = new Set(this.badges);

  // Top performer badges
  if (this.rank <= 10) newBadges.add('top10');
  if (this.rank <= 100) newBadges.add('top100');

  // Streak badges
  if (this.streak.days >= 7) newBadges.add('streak');
  if (this.streak.days >= 30) newBadges.add('champion');

  // Rising star (rank improvement)
  if (this.previousRank && this.rank < this.previousRank) {
    newBadges.add('rising');
  }

  this.badges = Array.from(newBadges);
};

// Static method for leaderboard pagination
leaderboardSchema.statics.getLeaderboard = function(category = 'global', page = 1, limit = 50) {
  return this.find({ category })
    .sort({ score: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'username avatar')
    .lean();
};

// Static method to recalculate all ranks
leaderboardSchema.statics.recalculateRanks = async function(category = 'global') {
  const entries = await this.find({ category }).sort({ score: -1 }).lean();
  
  const bulkOps = entries.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { $set: { rank: index + 1 } }
    }
  }));

  await this.bulkWrite(bulkOps);
  return entries.length;
};

// Static method for percentile calculation
leaderboardSchema.statics.calculatePercentiles = async function(category = 'global') {
  const [count, scores] = await Promise.all([
    this.countDocuments({ category }),
    this.find({ category }).select('score').sort({ score: 1 }).lean()
  ]);

  const bulkOps = scores.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { $set: { percentile: Math.round((index / count) * 100) } }
    }
  }));

  await this.bulkWrite(bulkOps);
  return count;
};

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
