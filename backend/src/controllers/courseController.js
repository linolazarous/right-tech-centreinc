import CourseModel from '../models/courseModel.js';
import logger from '../utils/logger.js';

export const getCourses = async (req, res) => {
  try {
    const { category, limit = '20', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    const filter = category ? { category } : {};
    const courses = await CourseModel.find(filter)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .select('-__v -lessons -enrolledStudents')
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      page: pageNum,
      data: courses,
    });
  } catch (error) {
    logger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch courses.' });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const { limit = '20', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    const courses = await CourseModel.find({ published: true })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .select('-__v -lessons -enrolledStudents')
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      page: pageNum,
      data: courses,
    });
  } catch (error) {
    logger.error(`Error fetching published courses: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch published courses.' });
  }
};
