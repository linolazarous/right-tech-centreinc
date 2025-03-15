const CorporateTraining = require('../models/CorporateTraining');

exports.createTraining = async (trainingData) => {
    const training = new CorporateTraining(trainingData);
    await training.save();
    return training;
};