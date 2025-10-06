import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 1000 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    language: { type: String, enum: ['en', 'fr', 'es', 'de'], default: 'en' },
    price: { type: Number, default: 0 },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    duration: { type: Number, min: 1, max: 1000 }, // hours
    lessons: [
      {
        title: String,
        contentUrl: String,
        duration: Number,
        isPreview: { type: Boolean, default: false },
      },
    ],
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 📊 Index for category and tags
courseSchema.index({ category: 1, tags: 1 });

// 🧠 Virtual total duration (sum of lessons)
courseSchema.virtual('totalDuration').get(function () {
  return this.lessons?.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
});

export default mongoose.model('Course', courseSchema);
