import mongoose from 'mongoose';
import geoip from 'geoip-lite'; // For IP-based geolocation

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    index: true
  },
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'course_view',
      'lesson_start',
      'lesson_complete',
      'quiz_attempt',
      'quiz_pass',
      'quiz_fail',
      'resource_download',
      'video_play',
      'video_pause',
      'video_complete',
      'certificate_earned',
      'enrollment',
      'completion',
      'search',
      'login',
      'logout',
      'payment',
      'refund',
      'support_request'
    ],
    index: true
  },
  activityDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  duration: {
    type: Number,
    min: 0,
    max: 86400 // Max 24 hours
  },
  deviceInfo: {
    type: {
      type: { type: String, enum: ['desktop', 'mobile', 'tablet', 'bot', 'other'] },
      platform: String,
      os: String,
      browser: String,
      browserVersion: String,
      screenResolution: String,
      deviceModel: String
    }
  },
  locationInfo: {
    ip: String,
    country: String,
    region: String,
    city: String,
    timezone: String,
    ll: [Number] // [latitude, longitude]
  },
  referrer: {
    type: {
      url: String,
      domain: String,
      medium: String // organic, email, social, referral, etc.
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year TTL
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true },
  collation: { locale: 'en', strength: 2 }
});

// ==============================================
// Indexes for Performance
// ==============================================
analyticsSchema.index({ userId: 1, courseId: 1, timestamp: -1 });
analyticsSchema.index({ activityType: 1, timestamp: -1 });
analyticsSchema.index({ 'locationInfo.country': 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, timestamp: -1 });
analyticsSchema.index({ 'deviceInfo.type': 1, timestamp: -1 });

// ==============================================
// Virtual Properties
// ==============================================
analyticsSchema.virtual('date').get(function() {
  return this.timestamp.toISOString().split('T')[0];
});

analyticsSchema.virtual('isAuthenticated').get(function() {
  return !!this.userId;
});

// ==============================================
// Middleware
// ==============================================
analyticsSchema.pre('save', function(next) {
  // Set anonymousId if no userId
  if (!this.userId && !this.anonymousId) {
    this.anonymousId = crypto.randomBytes(16).toString('hex');
  }

  // Extract location info from IP
  if (this.locationInfo?.ip) {
    const geo = geoip.lookup(this.locationInfo.ip);
    if (geo) {
      this.locationInfo = {
        ...this.locationInfo,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        timezone: geo.timezone,
        ll: geo.ll
      };
    }
  }

  // Parse referrer domain
  if (this.referrer?.url && !this.referrer.domain) {
    try {
      const domain = new URL(this.referrer.url).hostname.replace('www.', '');
      this.referrer.domain = domain;
    } catch (e) {
      this.referrer.domain = 'invalid';
    }
  }

  next();
});

// ==============================================
// Static Methods
// ==============================================
analyticsSchema.statics = {
  async getUserActivity(userId, days = 30, limit = 100) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.find({
      userId,
      timestamp: { $gte: date }
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('courseId', 'title slug')
    .populate('lessonId', 'title')
    .lean();
  },

  async getCourseEngagement(courseId, timeRange = '7d') {
    const date = getDateFromRange(timeRange);
    
    return this.aggregate([
      { $match: { 
        courseId: mongoose.Types.ObjectId(courseId),
        timestamp: { $gte: date }
      }},
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          users: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          activityType: '$_id',
          count: 1,
          totalDuration: 1,
          avgDuration: 1,
          uniqueUsers: { $size: '$users' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  },

  async getPlatformMetrics(timeRange = '7d') {
    const date = getDateFromRange(timeRange);
    
    return this.aggregate([
      { $match: { timestamp: { $gte: date } } },
      {
        $facet: {
          activityTypes: [
            { $group: { 
              _id: '$activityType',
              count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          dailyActivity: [
            { 
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 },
                users: { $addToSet: '$userId' }
              }
            },
            {
              $project: {
                date: '$_id',
                count: 1,
                uniqueUsers: { $size: '$users' }
              }
            },
            { $sort: { date: 1 } }
          ],
          topCourses: [
            { $match: { courseId: { $exists: true } } },
            { $group: { 
              _id: '$courseId',
              count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: {
              from: 'courses',
              localField: '_id',
              foreignField: '_id',
              as: 'course'
            }},
            { $unwind: '$course' },
            { $project: {
              courseId: '$_id',
              title: '$course.title',
              count: 1
            }}
          ],
          deviceBreakdown: [
            { $group: { 
              _id: '$deviceInfo.type',
              count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
          ]
        }
      }
    ]);
  }
};

// ==============================================
// Helper Functions
// ==============================================
function getDateFromRange(range) {
  const date = new Date();
  const unit = range.slice(-1);
  const value = parseInt(range.slice(0, -1));

  switch(unit) {
    case 'd': date.setDate(date.getDate() - value); break;
    case 'w': date.setDate(date.getDate() - (value * 7)); break;
    case 'm': date.setMonth(date.getMonth() - value); break;
    default: date.setDate(date.getDate() - 7); // Default to 7 days
  }
  return date;
}

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
