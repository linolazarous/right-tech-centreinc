const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateUserRegistration, validateRequest };