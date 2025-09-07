import mongoose from 'mongoose';
import validator from 'validator';

const liveQASchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters'],
    minlength: [10, 'Question must be at least 10 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    validate: {
      validator: v => /^[a-z0-9-]+$/.test(v),
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  details: {
    type: String,
    maxlength: [2000, 'Details cannot exceed 2000 characters'],
    trim: true
  },
  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Asker ID is required'],
    index: true
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    index: true
  },
  answer: {
    type: String,
    maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    trim: true
  },
  answerAudio: {
    type: String,
    validate: {
      validator: v => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true
      }),
      message: 'Invalid audio URL'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'approved', 'rejected', 'featured'],
    default: 'pending',
    index: true
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
    lowercase: true,
    trim: true
  }],
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  answeredAt: Date,
  lastActivityAt: {
    type: Date,
    default: Date.now
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
  toObject: { virtuals: true },
  timestamps: false
});

liveQASchema.index({ question: 'text', answer: 'text', tags: 'text' });
liveQASchema.index({ status: 1, createdAt: -1 });
liveQASchema.index({ answeredBy: 1, status: 1 });
liveQASchema.index({ tags: 1, status: 1 });
liveQASchema.index({ 'upvotes': -1 });

liveQASchema.index({
  question: 'text',
  answer: 'text',
  tags: 'text',
  details: 'text'
}, {
  weights: {
    question: 10,
    tags: 5,
    answer: 3,
    details: 1
  },
  name: 'qa_text_search'
});

liveQASchema.virtual('voteScore').get(function() {
  return this.upvotes - this.downvotes;
});

liveQASchema.virtual('responseTime').get(function() {
  return this.answeredAt ? this.answeredAt - this.createdAt : null;
});

liveQASchema.virtual('isAnswered').get(function() {
  return this.status === 'answered' || this.status === 'approved' || this.status === 'featured';
});

liveQASchema.pre('save', function(next) {
  this.updatedAt = new Date();

  if (!this.slug) {
    const baseSlug = this.question.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  if (this.isModified('answer') || this.isModified('status')) {
    this.lastActivityAt = new Date();
  }

  if (this.isModified('status') && this.status === 'answered' && !this.answeredAt) {
    this.answeredAt = new Date();
  }

  next();
});

liveQASchema.methods.upvote = async function() {
  this.upvotes += 1;
  await this.save();
};

liveQASchema.methods.downvote = async function() {
  this.downvotes += 1;
  await this.save();
};

liveQASchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

liveQASchema.methods.approveAnswer = async function(moderatorId) {
  this.status = 'approved';
  this.moderatedBy = moderatorId;
  await this.save();
};

liveQASchema.statics.getPopularQuestions = function(limit = 10) {
  return this.find({ status: 'answered' })
    .sort({ upvotes: -1, views: -1 })
    .limit(limit)
    .populate('askedBy', 'username avatar')
    .populate('answeredBy', 'username credentials')
    .lean();
};

liveQASchema.statics.getUnansweredQuestions = function(limit = 20) {
  return this.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('askedBy', 'username')
    .lean();
};

liveQASchema.statics.searchQuestions = function(query, limit = 20) {
  return this.find(
    { $text: { $search: query }, status: 'answered' },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit)
  .populate('answeredBy', 'username credentials')
  .lean();
};

export default mongoose.model('LiveQA', liveQASchema);
