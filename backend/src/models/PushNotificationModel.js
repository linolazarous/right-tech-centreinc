const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const pushNotificationSchema = new mongoose.Schema({
  // Recipient Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  deviceId: {
    type: String,
    index: true
  },
  devicePlatform: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: [true, 'Device platform is required'],
    index: true
  },
  deviceToken: {
    type: String,
    index: true,
    sparse: true
  },

  // Notification Content
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(https?:\/\/).+\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: 'Image URL must be a valid image URL (jpg, jpeg, png, gif)'
    }
  },
  deepLink: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[a-z]+:\/\//i.test(v);
      },
      message: 'Deep link must be a valid URI scheme'
    }
  },
  dataPayload: {
    type: Object,
    default: {}
  },

  // Notification Metadata
  notificationType: {
    type: String,
    enum: [
      'transactional',
      'marketing',
      'alert',
      'reminder',
      'system',
      'social',
      'promotional'
    ],
    required: [true, 'Notification type is required'],
    index: true
  },
  category: {
    type: String,
    index: true
  },
  priority: {
    type: String,
    enum: ['normal', 'high'],
    default: 'normal'
  },
  badgeCount: {
    type: Number,
    min: 0,
    default: 0
  },

  // Delivery Status
  status: {
    type: String,
    enum: [
      'queued',
      'processing',
      'sent',
      'delivered',
      'failed',
      'read',
      'dismissed'
    ],
    default: 'queued',
    index: true
  },
  deliveryAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAttemptAt: {
    type: Date
  },
  failureReason: {
    type: String,
    enum: [
      'invalid_token',
      'device_not_registered',
      'message_too_large',
      'invalid_payload',
      'service_unavailable',
      'rate_limited',
      'other'
    ]
  },
  serviceProvider: {
    type: String,
    enum: ['fcm', 'apns', 'web_push', 'onesignal', 'other'],
    required: [true, 'Service provider is required']
  },
  providerMessageId: {
    type: String,
    index: true,
    sparse: true
  },

  // Timing Information
  scheduledAt: {
    type: Date,
    index: true,
    default: Date.now
  },
  sentAt: {
    type: Date,
    index: true
  },
  deliveredAt: {
    type: Date,
    index: true
  },
  readAt: {
    type: Date,
    index: true
  },
  expiresAt: {
    type: Date,
    index: true,
    validate: {
      validator: function(v) {
        return !v || v > this.scheduledAt;
      },
      message: 'Expiration must be after scheduled time'
    }
  },

  // Analytics
  openCount: {
    type: Number,
    default: 0,
    min: 0
  },
  interaction: {
    type: String,
    enum: ['none', 'opened', 'button_click', 'dismissed'],
    default: 'none'
  },
  interactionTimestamp: {
    type: Date
  },

  // Metadata
  campaignId: {
    type: String,
    index: true
  },
  metadata: {
    type: Object,
    default: {}
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
pushNotificationSchema.index({ userId: 1, status: 1 });
pushNotificationSchema.index({ status: 1, scheduledAt: 1 });
pushNotificationSchema.index({ notificationType: 1, createdAt: -1 });
pushNotificationSchema.index({ createdAt: -1 });
pushNotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hooks
pushNotificationSchema.pre('save', function(next) {
  // Update timestamps based on status changes
  if (this.isModified('status')) {
    switch (this.status) {
      case 'sent':
        this.sentAt = this.sentAt || new Date();
        break;
      case 'delivered':
        this.deliveredAt = this.deliveredAt || new Date();
        break;
      case 'read':
        this.readAt = this.readAt || new Date();
        break;
    }
  }

  // Update interaction timestamp
  if (this.isModified('interaction') && this.interaction !== 'none') {
    this.interactionTimestamp = new Date();
  }

  next();
});

// Static Methods
pushNotificationSchema.statics.findPendingNotifications = async function(limit = 100) {
  try {
    return await this.find({ 
      status: { $in: ['queued', 'processing'] },
      scheduledAt: { $lte: new Date() },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    })
    .sort({ priority: -1, scheduledAt: 1 })
    .limit(limit);
  } catch (error) {
    logger.error('Error finding pending notifications:', error);
    throw error;
  }
};

pushNotificationSchema.statics.markAsFailed = async function(notificationId, reason) {
  try {
    return await this.findByIdAndUpdate(
      notificationId,
      {
        status: 'failed',
        failureReason: reason,
        $inc: { deliveryAttempts: 1 },
        lastAttemptAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error marking notification ${notificationId} as failed:`, error);
    throw error;
  }
};

// Instance Methods
pushNotificationSchema.methods.markAsDelivered = async function(providerMessageId) {
  try {
    this.status = 'delivered';
    this.providerMessageId = providerMessageId;
    this.deliveredAt = new Date();
    return await this.save();
  } catch (error) {
    logger.error(`Error marking notification ${this._id} as delivered:`, error);
    throw error;
  }
};

pushNotificationSchema.methods.recordInteraction = async function(interactionType) {
  try {
    this.interaction = interactionType;
    if (interactionType === 'opened') {
      this.status = 'read';
      this.readAt = new Date();
      this.$inc = { openCount: 1 };
    }
    return await this.save();
  } catch (error) {
    logger.error(`Error recording interaction for notification ${this._id}:`, error);
    throw error;
  }
};

// Virtuals
pushNotificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

pushNotificationSchema.virtual('deliveryTimeMs').get(function() {
  if (!this.sentAt || !this.deliveredAt) return null;
  return this.deliveredAt - this.sentAt;
});

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

module.exports = PushNotification;
