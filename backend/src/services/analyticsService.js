const User = require('../models/User');
const Course = require('../models/Course');

exports.getStudentProgress = async (userId) => {
    const user = await User.findById(userId).populate('enrolledCourses');
    const progress = user.enrolledCourses.map((course) => ({
        courseId: course._id,
        courseTitle: course.title,
        progress: Math.floor(Math.random() * 100), // Mock progress
    }));
    return progress;
};

exports.getEngagementMetrics = async (userId) => {
    const user = await User.findById(userId);
    return {
        timeSpent: Math.floor(Math.random() * 100), // Mock time spent
        quizzesTaken: Math.floor(Math.random() * 10), // Mock quizzes taken
        coursesCompleted: Math.floor(Math.random() * 5), // Mock courses completed
    };
};