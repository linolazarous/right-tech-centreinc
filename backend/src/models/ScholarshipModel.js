const mongoose = require('mongoose');
const { DO_SPACE_URL } = process.env;

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: 'text' // Full-text search optimization
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description should be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    eligibilityCriteria: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      minlength: [30, 'Eligibility criteria should be at least 30 characters']
    },
    amount: {
      value: {
        type: Number,
        min: [0, 'Amount cannot be negative'],
        required: function() { return this.amount.currency }
      },
      currency: {
        type: String,
        uppercase: true,
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', ''],
        default: 'USD'
      },
      renewable: {
        type: Boolean,
        default: false
      }
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      validate: {
        validator: function(v) {
          return v > new Date(); // Deadline must be in future
        },
        message: 'Deadline must be in the future'
      }
    },
    applicationLink: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: 'Invalid URL format'
      }
    },
    documents: [{
      name: String,
      url: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || v.startsWith(DO_SPACE_URL);
          },
          message: 'Document must be hosted on DigitalOcean Spaces'
        }
      }
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true // For filtering active scholarships
    },
    categories: {
      type: [String],
      required: true,
      enum: {
        values: ['academic', 'athletic', 'arts', 'stem', 'minority', 'need-based', 'merit'],
        message: 'Invalid category'
      }
    }
  },
  {
    // DigitalOcean Optimized Settings
    timestamps: true, // createdAt and updatedAt
    strict: true, // Reject undefined fields
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// DigitalOcean Performance Indexes
scholarshipSchema.index({ deadline: 1 }); // For upcoming deadline queries
scholarshipSchema.index({ amount: 1 }); // For scholarship amount filtering
scholarshipSchema.index({ isActive: 1, deadline: 1 }); // Combined index

// Virtual for days remaining (DigitalOcean monitoring friendly)
scholarshipSchema.virtual('daysRemaining').get(function() {
  return Math.ceil((this.deadline - Date.now()) / (1000 * 60 * 60 * 24));
});

// Query Helpers for DigitalOcean Efficiency
scholarshipSchema.query.active = function() {
  return this.where({ isActive: true });
};

scholarshipSchema.query.upcoming = function(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return this.where({ deadline: { $lte: date }, isActive: true });
};

// DigitalOcean Monitoring Hooks
scholarshipSchema.post('save', function(doc) {
  console.log(`[DO Monitoring] Scholarship saved - ${doc.title} (ID: ${doc._id})`);
});

scholarshipSchema.post('find', function(docs) {
  console.log(`[DO Monitoring] Scholarships query returned ${docs.length} records`);
});

// Auto-deactivate past deadlines
scholarshipSchema.pre('save', function(next) {
  if (this.deadline < new Date() && this.isActive) {
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
