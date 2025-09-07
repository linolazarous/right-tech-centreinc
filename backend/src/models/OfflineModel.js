import mongoose from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

const offlineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    minlength: [5, 'Title must be at least 5 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  location: {
    type: {
      name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
      },
      postalCode: {
        type: String,
        trim: true
      },
      coordinates: {
        type: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true }
        },
        validate: {
          validator: function(v) {
            return v.lat >= -90 && v.lat <= 90 && 
                   v.lng >= -180 && v.lng <= 180;
          },
          message: props => `Invalid coordinates: ${JSON.stringify(props.value)}`
        }
      },
      online: {
        type: Boolean,
        default: false
      },
      virtualUrl: {
        type: String,
        validate: {
          validator: function(v) {
            if (!this.location.online) return true;
            return validator.isURL(v, {
              protocols: ['http', 'https'],
              require_protocol: true
            });
          },
          message: props => `${props.value} is not a valid URL!`
        }
      }
    },
    required: [true, 'Location information is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  categories: [{
    type: String,
    enum: [
      'conference', 'workshop', 'meetup', 'exhibition',
      'concert', 'festival', 'sports', 'networking',
      'education', 'business', 'community', 'other'
    ]
  }],
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 15;
      },
      message: 'Cannot have more than 15 tags'
    }
  },
  imageUrls: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 images'
    }
  },
  ticketInfo: {
    required: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      min: 0,
      required: function() { return this.ticketInfo.required; }
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      required: function() { return this.ticketInfo.required; }
    },
    available: {
      type: Number,
      min: 0,
      required: function() { return this.ticketInfo.required; }
    },
    purchaseUrl: {
      type: String,
      validate: {
        validator: function(v) {
          if (!this.ticketInfo.required) return true;
          return validator.isURL(v, {
            protocols: ['http', 'https'],
            require_protocol: true
          });
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  },
  capacity: {
    type: Number,
    min: 1
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!this.registrationRequired) return true;
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'postponed', 'completed'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

offlineSchema.index({ title: 'text', description: 'text', tags: 'text' });
offlineSchema.index({ slug: 1 }, { unique: true });
offlineSchema.index({ 'location.coordinates': '2dsphere' });
offlineSchema.index({ startDate: 1, endDate: 1 });
offlineSchema.index({ organizer: 1, status: 1 });
offlineSchema.index({ status: 1, isFeatured: 1 });
offlineSchema.index({ categories: 1 });
offlineSchema.index({ 'location.city': 1, 'location.country': 1 });

offlineSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  if (this.isModified('startDate') || this.isModified('endDate')) {
    const now = new Date();
    if (this.status !== 'cancelled' && this.status !== 'postponed') {
      if (this.endDate < now) {
        this.status = 'completed';
      } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'published';
      }
    }
  }
  next();
});

offlineSchema.statics.findUpcoming = async function(limit = 10) {
  try {
    return await this.find({ 
      status: 'published',
      startDate: { $gt: new Date() }
    })
    .sort({ startDate: 1 })
    .limit(limit)
    .populate('organizer', 'name avatar');
  } catch (error) {
    console.error('Error finding upcoming events:', error);
    throw error;
  }
};

offlineSchema.statics.findByLocation = async function(city, country, radiusKm = 50) {
  try {
    return await this.find({
      'location.city': new RegExp(city, 'i'),
      'location.country': new RegExp(country, 'i'),
      status: 'published',
      startDate: { $gt: new Date() }
    })
    .sort({ startDate: 1 });
  } catch (error) {
    console.error(`Error finding events in ${city}, ${country}:`, error);
    throw error;
  }
};

offlineSchema.statics.findNearby = async function(lat, lng, radiusKm = 50) {
  try {
    return await this.find({
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: radiusKm * 1000
        }
      },
      status: 'published',
      startDate: { $gt: new Date() }
    })
    .sort({ startDate: 1 });
  } catch (error) {
    console.error(`Error finding nearby events to ${lat},${lng}:`, error);
    throw error;
  }
};

offlineSchema.methods.registerAttendee = async function(userId) {
  try {
    if (this.attendees.includes(userId)) {
      throw new Error('User already registered');
    }
    
    if (this.capacity && this.attendees.length >= this.capacity) {
      this.waitlist.push(userId);
    } else {
      this.attendees.push(userId);
    }
    
    await this.save();
    return this;
  } catch (error) {
    console.error(`Error registering attendee for event ${this._id}:`, error);
    throw error;
  }
};

offlineSchema.methods.publish = async function() {
  try {
    if (this.status === 'draft') {
      this.status = 'published';
      await this.save();
    }
    return this;
  } catch (error) {
    console.error(`Error publishing event ${this._id}:`, error);
    throw error;
  }
};

offlineSchema.virtual('isFree').get(function() {
  return !this.ticketInfo.required || this.ticketInfo.price === 0;
});

offlineSchema.virtual('spotsAvailable').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.attendees.length);
});

offlineSchema.virtual('durationHours').get(function() {
  return (this.endDate - this.startDate) / (1000 * 60 * 60);
});

offlineSchema.virtual('formattedDate').get(function() {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return {
    start: this.startDate.toLocaleDateString(undefined, options),
    end: this.endDate.toLocaleDateString(undefined, options)
  };
});

export default mongoose.model('OfflineEvent', offlineSchema);
