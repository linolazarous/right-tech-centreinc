const StudyGroup = require('../models/StudyGroup');

exports.createStudyGroup = async (groupData) => {
    const group = new StudyGroup(groupData);
    await group.save();
    return group;
};

exports.getStudyGroups = async () => {
    return await StudyGroup.find().populate('members', 'name');
};