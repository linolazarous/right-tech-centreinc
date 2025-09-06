import ProctoringModel from '../models/proctoringModel.js';
import logger from '../utils/logger.js';

class ProctoringService {
  static async startProctoringSession(sessionData) {
    try {
      if (!sessionData.userId || !sessionData.examId) {
        throw new Error('Missing required session data');
      }

      const newSession = new ProctoringModel({
        ...sessionData,
        startedAt: new Date(),
        status: 'active'
      });

      await newSession.validate();
      const savedSession = await newSession.save();
      
      logger.info(`Proctoring session started for user ${sessionData.userId}`);
      return savedSession;
    } catch (error) {
      logger.error(`Proctoring session start failed: ${error.message}`);
      throw new Error('Failed to start proctoring session');
    }
  }

  static async endProctoringSession(sessionId) {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const endedSession = await ProctoringModel.findByIdAndUpdate(
        sessionId,
        { 
          endedAt: new Date(),
          status: 'completed'
        },
        { new: true }
      );

      if (!endedSession) {
        throw new Error('Session not found');
      }

      logger.info(`Proctoring session ${sessionId} ended`);
      return endedSession;
    } catch (error) {
      logger.error(`Failed to end proctoring session: ${error.message}`);
      throw new Error('Failed to end proctoring session');
    }
  }
}

export default ProctoringService;
