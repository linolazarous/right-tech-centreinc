const express = require('express');
const router = express.Router();
const AccessibilitySettingController = require('../controllers/accessibilitySettingController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const { validate } = require('../middleware/validationMiddleware');
const { 
  accessibilitySettingGetSchema,
  accessibilitySettingUpdateSchema 
} = require('../validations/accessibilityValidation');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @swagger
 * tags:
 *   name: Accessibility Settings
 *   description: User accessibility preferences management
 */

/**
 * @swagger
 * /api/accessibility/{userId}:
 *   get:
 *     summary: Get user's accessibility settings
 *     tags: [Accessibility Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: Accessibility settings retrieved successfully
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:userId',
  apiLimiter,
  authMiddleware,
  validate(accessibilitySettingGetSchema),
  AccessibilitySettingController.getSettings
);

/**
 * @swagger
 * /api/accessibility/{userId}:
 *   put:
 *     summary: Update user's accessibility settings
 *     tags: [Accessibility Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessibilitySettings'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:userId',
  apiLimiter,
  authMiddleware,
  validate(accessibilitySettingUpdateSchema),
  AccessibilitySettingController.updateSettings
);

module.exports = router;
