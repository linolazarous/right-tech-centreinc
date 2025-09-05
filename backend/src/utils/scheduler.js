import { generateAndPostAd } from "../controllers/adController.js";
import cron from "node-cron";
import logger from "./logger.js";
import { isMainProcess } from "./utils.js"; // Helper to check if in main process

class AdScheduler {
  constructor() {
    this.scheduledJobs = new Map();
    this.initialize();
  }

  initialize() {
    // Only schedule in main process and production environment
    if (isMainProcess() && process.env.NODE_ENV === 'production') {
      this.scheduleDailyAdGeneration();
      logger.info('✅ Ad scheduler initialized');
    } else {
      logger.debug('Scheduler not initialized (not in main process or development mode)');
    }
  }

  scheduleDailyAdGeneration() {
    try {
      // Schedule at midnight every day
      const job = cron.schedule(
        "0 0 * * *", // Runs at 00:00 (midnight) UTC daily
        this.executeAdGeneration.bind(this),
        {
          scheduled: true,
          timezone: "UTC", // Explicit timezone for consistency
          recoverMissedExecutions: false // Prevent unexpected bursts
        }
      );

      this.scheduledJobs.set('dailyAdGeneration', job);
      logger.info('Scheduled daily ad generation job');

    } catch (error) {
      logger.error('Failed to schedule ad generation', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async executeAdGeneration() {
    try {
      logger.info('Starting scheduled ad generation...');
      const startTime = Date.now();
      
      await generateAndPostAd();
      
      const duration = Date.now() - startTime;
      logger.info('Completed scheduled ad generation', {
        duration: `${duration}ms`,
        success: true
      });

    } catch (error) {
      logger.error('Failed during scheduled ad generation', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Implement your retry logic or notification here if needed
    }
  }

  stopAllJobs() {
    this.scheduledJobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped scheduled job: ${name}`);
    });
    this.scheduledJobs.clear();
  }
}

// Singleton pattern to prevent multiple instances
const schedulerInstance = new AdScheduler();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, stopping scheduler jobs...');
  schedulerInstance.stopAllJobs();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, stopping scheduler jobs...');
  schedulerInstance.stopAllJobs();
  process.exit(0);
});

export default schedulerInstance;
