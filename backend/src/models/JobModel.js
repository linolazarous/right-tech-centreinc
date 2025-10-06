import mongoose from 'mongoose';
import validator from 'validator';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
    salaryRange: { min: Number, max: Number },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    skillsRequired: [{ type: String }],
    link: {
      type: String,
      validate: {
        validator: (v) => !v || validator.isURL(v),
        message: 'Invalid URL format',
      },
    },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// 🔍 Index for search optimization
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
