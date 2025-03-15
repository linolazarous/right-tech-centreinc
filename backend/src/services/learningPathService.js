const User = require('../models/User');
const Course = require('../models/Course');

exports.getLearningPath = async (userId) => {
    const user = await User.findById(userId);
    const courses = await Course.find({ skills: { $in: user.skills } });
    return courses;
};