const Job = require('../models/Job');

exports.getJobRecommendations = async (userId) => {
    const user = await User.findById(userId);
    const jobs = await Job.find({ skillsRequired: { $in: user.skills } });
    return jobs;
};