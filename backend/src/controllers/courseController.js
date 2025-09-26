import CourseModel from '../models/CourseModel.js';
import logger from '../utils/logger.js';
import { validateCourse } from '../validators/courseValidator.js';

export const createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        
        // Validate input
        const validation = validateCourse(courseData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info('Creating new course', { title: courseData.title });
        const course = new CourseModel(courseData);
        await course.save();

        logger.info(`Course created: ${course._id}`);
        res.status(201).json({
            id: course._id,
            title: course.title,
            instructor: course.instructor,
            category: course.category,
            createdAt: course.createdAt
        });
    } catch (error) {
        logger.error(`Error creating course: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Course with this title already exists' });
        }
        
        res.status(500).json({ 
            error: 'Failed to create course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getCourses = async (req, res) => {
    try {
        const { category, instructor, limit = 20 } = req.query;
        
        // Validate query parameters
        if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
            return res.status(400).json({ error: 'Limit must be between 1 and 100' });
        }

        const filter = {};
        if (category) filter.category = category;
        if (instructor) filter.instructor = instructor;

        logger.info('Fetching courses', { filter });
        const courses = await CourseModel.find(filter)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .select('-__v -lessons -enrolledStudents');

        res.status(200).json({
            count: courses.length,
            filters: { category, instructor },
            courses
        });
    } catch (error) {
        logger.error(`Error getting courses: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to retrieve courses',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info('Fetching course by ID', { courseId: id });
        const course = await CourseModel.findById(id)
            .populate('instructor', 'name avatar')
            .populate('enrolledStudents', 'name email')
            .select('-__v');

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        logger.error(`Error getting course by ID: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }
        
        res.status(500).json({ 
            error: 'Failed to retrieve course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        logger.info('Updating course', { courseId: id });
        const course = await CourseModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v -lessons -enrolledStudents');

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        logger.info(`Course updated: ${id}`);
        res.status(200).json(course);
    } catch (error) {
        logger.error(`Error updating course: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }
        
        res.status(500).json({ 
            error: 'Failed to update course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info('Deleting course', { courseId: id });
        const course = await CourseModel.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        logger.info(`Course deleted: ${id}`);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting course: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }
        
        res.status(500).json({ 
            error: 'Failed to delete course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getPublishedCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, level } = req.query;

        const filter = { status: 'published' };
        if (category) filter.category = category;
        if (level) filter.level = level;

        logger.info('Fetching published courses', { filter, page, limit });
        const courses = await CourseModel.find(filter)
            .populate('instructor', 'name avatar')
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-__v -lessons -enrolledStudents');

        const total = await CourseModel.countDocuments(filter);

        res.status(200).json({
            courses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error(`Error getting published courses: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to retrieve published courses',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getPublishedCourses
};
