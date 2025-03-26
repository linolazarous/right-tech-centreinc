const { body, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const validator = require('validator');
const PasswordValidator = require('password-validator');

// Create a password schema
const passwordSchema = new PasswordValidator()
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .has().not().spaces();

const validateUserRegistration = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (email) => {
      const isDisposable = await validator.isDisposableEmail(email);
      if (isDisposable) {
        throw new Error('Disposable emails are not allowed');
      }
      return true;
    }),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .custom(password => passwordSchema.validate(password))
    .withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, one number, one symbol, and no spaces'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role specified')
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

const validateObjectId = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID is required')
    .custom((value) => Types.ObjectId.isValid(value))
    .withMessage('Invalid ID format')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
      requestId: req.id || 'unknown-request',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

const sanitizeInput = (req, res, next) => {
  // Sanitize all string fields in body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key].trim());
      }
    });
  }
  
  // Sanitize all string fields in params
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = validator.escape(req.params[key].trim());
      }
    });
  }
  
  // Sanitize all string fields in query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = validator.escape(req.query[key].trim());
      }
    });
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateObjectId,
  validateRequest,
  sanitizeInput,
  passwordSchema
};
