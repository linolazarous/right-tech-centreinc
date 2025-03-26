const AccessibilitySetting = require('../models/accessibilitySettingModel');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const metrics = require('../utils/metrics'); // For performance monitoring

class AccessibilitySettingController {
  /**
   * Get accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Response>}
   */
  static async getSettings(req, res) {
    const startTime = Date.now();
    const requestId = req.id || crypto.randomUUID();
    const metricTags = { method: 'getSettings', requestId };

    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        metrics.increment('validation.failed', metricTags);
        logger.warn('Validation failed', {
          requestId,
          errors: errors.array(),
          params: req.params
        });
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: errors.array().map(err => ({
            param: err.param,
            msg: err.msg,
            location: err.location
          })),
          requestId
        });
      }

      const { userId } = req.params;

      // Verify user exists and has permission (added security check)
      if (!await verifyUserExists(userId, req.user)) {
        metrics.increment('access.denied', metricTags);
        return res.status(403).json({
          success: false,
          error: 'Access Denied',
          requestId
        });
      }

      const settings = await AccessibilitySetting.findOne({ userId })
        .select('-__v -createdAt -updatedAt') // Exclude unnecessary fields
        .lean()
        .maxTimeMS(5000) // Query timeout
        .exec();

      if (!settings) {
        metrics.increment('settings.not_found', metricTags);
        return res.status(404).json({
          success: false,
          error: 'Settings not found',
          requestId,
          links: {
            create: `${req.baseUrl}/${userId}`,
            method: 'PUT'
          }
        });
      }

      metrics.timing('query.time', Date.now() - startTime, metricTags);
      metrics.increment('settings.retrieved', metricTags);

      return res.status(200).json({
        success: true,
        data: {
          id: settings._id,
          ...settings
        },
        meta: {
          requestId,
          responseTime: `${Date.now() - startTime}ms`
        }
      });

    } catch (error) {
      metrics.increment('server.error', metricTags);
      logger.error('Failed to get settings', {
        requestId,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        params: req.params,
        user: req.user?.id
      });

      const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;
      return res.status(status).json({
        success: false,
        error: status === 400 ? 'Validation Error' : 'Internal Server Error',
        ...(status === 400 && { details: error.message }),
        requestId,
        meta: {
          timestamp: new Date().toISOString(),
          docs: 'https://api.yourdomain.com/docs/errors'
        }
      });
    }
  }

  /**
   * Update or create accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Response>}
   */
  static async updateSettings(req, res) {
    const startTime = Date.now();
    const requestId = req.id || crypto.randomUUID();
    const metricTags = { method: 'updateSettings', requestId };

    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        metrics.increment('validation.failed', metricTags);
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: errors.array(),
          requestId
        });
      }

      const { userId } = req.params;
      const updateFields = sanitizeInput(req.body);

      // Verify user exists and has permission
      if (!await verifyUserExists(userId, req.user)) {
        metrics.increment('access.denied', metricTags);
        return res.status(403).json({
          success: false,
          error: 'Access Denied',
          requestId
        });
      }

      const result = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        updateFields,
        {
          new: true,
          upsert: true,
          runValidators: true,
          lean: true,
          setDefaultsOnInsert: true,
          maxTimeMS: 10000 // Longer timeout for updates
        }
      ).select('-__v -createdAt -updatedAt').exec();

      metrics.timing('update.time', Date.now() - startTime, metricTags);
      metrics.increment('settings.updated', metricTags);

      return res.status(200).json({
        success: true,
        data: {
          id: result._id,
          ...result
        },
        meta: {
          requestId,
          responseTime: `${Date.now() - startTime}ms`,
          updatedFields: Object.keys(updateFields)
        }
      });

    } catch (error) {
      metrics.increment('update.failed', metricTags);
      logger.error('Update failed', {
        requestId,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        params: req.params,
        body: req.body,
        user: req.user?.id
      });

      const status = determineErrorStatus(error);
      return res.status(status).json({
        success: false,
        error: getErrorMessage(error),
        ...(status === 400 && { details: error.errors || error.message }),
        requestId,
        meta: {
          timestamp: new Date().toISOString(),
          docs: 'https://api.yourdomain.com/docs/errors'
        }
      });
    }
  }
}

// Helper functions
async function verifyUserExists(userId, requestingUser) {
  if (!Types.ObjectId.isValid(userId)) return false;
  
  // Only allow users to access their own settings unless admin
  if (requestingUser?.id !== userId && !requestingUser?.roles?.includes('admin')) {
    return false;
  }
  
  // In production, you might actually check the user exists in DB
  return true;
}

function sanitizeInput(input) {
  const allowedFields = [
    'highContrastMode',
    'fontSize',
    'screenReaderEnabled',
    'colorTheme'
  ];
  
  return Object.keys(input)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = sanitizeValue(input[key], key);
      return obj;
    }, {});
}

function sanitizeValue(value, field) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

function determineErrorStatus(error) {
  if (error instanceof mongoose.Error.ValidationError) return 400;
  if (error instanceof mongoose.Error.CastError) return 400;
  if (error.name === 'MongoServerError' && error.code === 11000) return 409;
  return 500;
}

function getErrorMessage(error) {
  if (error instanceof mongoose.Error.ValidationError) return 'Validation Failed';
  if (error instanceof mongoose.Error.CastError) return 'Invalid Data Format';
  if (error.name === 'MongoServerError' && error.code === 11000) return 'Conflict - Document already exists';
  return 'Internal Server Error';
}

module.exports = AccessibilitySettingController;
