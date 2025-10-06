import mongoose from 'mongoose';

const proctoringSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  sessionId: { type: String, required: true, unique: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: Date,
  deviceInfo: {
    os: String, browser: String, ipAddress: String, deviceType: String
  },
  authentication: {
    method: { type: String, enum: ['password', 'biometric', '2fa'], default: 'password' },
    verified: Boolean
  },
  activityLogs: [{
    timestamp: { type: Date, required: true },
    eventType: {
      type: String,
      enum: ['tab_switch', 'copy_attempt', 'face_not_visible', 'multiple_faces', 'noise_detected'],
      required: true
    },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  }],
  flaggedEvents: [{
    type: {
      type: String,
      enum: ['cheating_suspected', 'identity_failed', 'environment_violation'],
      required: true
    },
    description: String,
    reviewed: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'terminated'],
    default: 'scheduled'
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

proctoringSchema.virtual('durationMinutes').get(function () {
  return this.endTime ? (this.endTime - this.startTime) / 60000 : 0;
});

proctoringSchema.statics.findActive = function () {
  return this.find({ status: { $in: ['in_progress', 'scheduled'] } });
};

export default mongoose.model('Proctoring', proctoringSchema);
