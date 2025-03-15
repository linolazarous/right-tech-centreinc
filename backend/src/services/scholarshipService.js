const Scholarship = require('../models/Scholarship');

exports.allocateScholarship = async (studentId, criteria) => {
    const student = await Student.findById(studentId);
    if (student.meetsCriteria(criteria)) {
        student.awardScholarship();
        await student.save();
    }
};