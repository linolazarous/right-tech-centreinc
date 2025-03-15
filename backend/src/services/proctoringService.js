const ProctoringModel = require('../models/proctoringModel');

class ProctoringService {
  static async startProctoringSession(sessionData) {
    const newSession = new ProctoringModel(sessionData);
    return await newSession.save();
  }

  static async endProctoringSession(sessionId) {
    return await ProctoringModel.findByIdAndUpdate(sessionId, { endedAt: new Date() }, { new: true });
  }
}

module.exports = ProctoringService;