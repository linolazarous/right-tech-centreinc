const Course = require('../models/Course');

exports.downloadCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    return course;
};