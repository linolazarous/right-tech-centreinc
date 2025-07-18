const { body, query, param, validationResult } = require('express-validator');
const createError = require('http-errors');

// Common validation chains
const emailValidator = body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail();

const passwordValidator = body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number');

// Validation schemas
const validateUserRegistration = [
    emailValidator,
    passwordValidator,
    body('name').trim().notEmpty().withMessage('Name is required')
];

const validateLogin = [
    emailValidator,
    body('password').notEmpty().withMessage('Password is required')
];

const validatePagination = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

const validateObjectId = param('id')
    .isMongoId()
    .withMessage('Invalid ID format');

// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));
        return next(createError.UnprocessableEntity({ errors: errorMessages }));
    }
    next();
};

const validate = (schemas) => {
    return [...schemas, validateRequest];
};

module.exports = {
    validateUserRegistration: validate(validateUserRegistration),
    validateLogin: validate(validateLogin),
    validatePagination: validate(validatePagination),
    validateObjectId,
    validateRequest,
    emailValidator,
    passwordValidator
};
