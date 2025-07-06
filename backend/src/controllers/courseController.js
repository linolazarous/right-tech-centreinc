const Course = require('../models/Course');
const logger = require('../utils/logger');
const { validateCourse } = require('../validators/courseValidator');

exports.createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        
        // Validate input
        const validation = validateCourse(courseData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info('Creating new course', { title: courseData.title });
        const course = new Course(courseData);
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

exports.getCourses = async (req, res) => {
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
        const courses = await Course.find(filter)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .select('-__v -lessons -students');

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
