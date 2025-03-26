const AccessibilitySetting = require('../models/accessibilitySettingModel');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');

class AccessibilitySettingController {
  /**
   * Get accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getSettings(req, res) {
    const startTime = process.hrtime();
    const requestId = req.id || 'unknown-request';

    try {
      // Validate input using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed', {
          requestId,
          errors: errors.array(),
          params: req.params
        });
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: errors.array(),
          requestId
        });
      }

      const { userId } = req.params;

      if (!Types.ObjectId.isValid(userId)) {
        logger.warn('Invalid ObjectId format', { requestId, userId });
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID format',
          details: 'Must be a valid MongoDB ObjectId',
          requestId
        });
      }

      const settings = await AccessibilitySetting.findOne({ userId })
        .select('-_id -__v') // Exclude fields directly in query
        .lean()
        .exec(); // Always use exec() with promises

      if (!settings) {
        logger.info('Settings not found', { requestId, userId });
        return res.status(404).json({
          success: false,
          error: 'Settings not found',
          suggestion: 'Create new settings using POST /accessibility',
          requestId
        });
      }

      logger.info('Settings retrieved successfully', {
        requestId,
        userId,
        duration: process.hrtime(startTime)
      });

      return res.status(200).json({
        success: true,
        data: settings,
        requestId
      });

    } catch (error) {
      logger.error('Failed to get settings', {
        requestId,
        error: error.message,
        stack: error.stack,
        params: req.params
      });

      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update or create accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async updateSettings(req, res) {
    const startTime = process.hrtime();
    const requestId = req.id || 'unknown-request';

    try {
      // Validate input using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed', {
          requestId,
          errors: errors.array(),
          params: req.params,
          body: req.body
        });
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: errors.array(),
          requestId
        });
      }

      const { userId } = req.params;
      const { highContrastMode, fontSize, screenReaderEnabled, colorTheme } = req.body;

      if (!Types.ObjectId.isValid(userId)) {
        logger.warn('Invalid ObjectId format', { requestId, userId });
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID format',
          details: 'Must be a valid MongoDB ObjectId',
          requestId
        });
      }

      const updateFields = {
        highContrastMode,
        fontSize,
        screenReaderEnabled,
        colorTheme,
        updatedAt: new Date()
      };

      // Remove undefined fields
      Object.keys(updateFields).forEach(key => 
        updateFields[key] === undefined && delete updateFields[key]
      );

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        updateFields,
        { 
          new: true,
          upsert: true,
          runValidators: true,
          lean: true,
          setDefaultsOnInsert: true
        }
      ).select('-_id -__v').exec();

      logger.info('Settings updated successfully', {
        requestId,
        userId,
        changes: updateFields,
        duration: process.hrtime(startTime)
      });

      return res.status(200).json({
        success: true,
        data: updatedSettings,
        requestId
      });

    } catch (error) {
      logger.error('Failed to update settings', {
        requestId,
        error: error.message,
        stack: error.stack,
        params: req.params,
        body: req.body
      });

      let status = 500;
      let errorMessage = 'Internal Server Error';

      if (error.name === 'ValidationError') {
        status = 400;
        errorMessage = 'Validation Error';
      } else if (error.name === 'CastError') {
        status = 400;
        errorMessage = 'Invalid Data Format';
      }

      return res.status(status).json({
        success: false,
        error: errorMessage,
        details: status !== 500 ? error.message : undefined,
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = AccessibilitySettingController;
