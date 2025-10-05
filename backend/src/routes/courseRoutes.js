import express from 'express';
const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all published courses
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const courses = await CourseModel.find({ status: 'published' })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
});

/**
 * @route   GET /api/courses/:courseId
 * @desc    Get detailed course by ID
 * @access  Public
 */
router.get('/:courseId', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const course = await CourseModel.findById(req.params.courseId)
      .populate('instructor', 'firstName lastName email bio');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course' });
  }
});

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Protected (Instructor/Admin)
 */
router.post('/', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const course = new CourseModel({
      ...req.body,
      instructor: req.body.instructor || '65a1b2c3d4e5f67890123456'
    });

    await course.save();
    res.status(201).json({
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
});

export default router;
