import express from 'express';
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const courses = await CourseModel.find({ status: 'published' })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// Get course by ID
router.get('/:courseId', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const course = await CourseModel.findById(req.params.courseId)
      .populate('instructor', 'firstName lastName email bio');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// Create new course (protected - requires auth)
router.post('/', async (req, res) => {
  try {
    // This would require authentication in a real scenario
    const CourseModel = (await import('../models/CourseModel.js')).default;
    
    const course = new CourseModel({
      ...req.body,
      instructor: req.body.instructor || '65a1b2c3d4e5f67890123456' // Default instructor ID
    });

    await course.save();

    res.status(201).json({
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
});

export default router;
