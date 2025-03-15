const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateUserRegistration, validateRequest } = require('../middleware/validationMiddleware');

// User login
router.post('/login', AuthController.login);

// User registration with validation middleware
router.post('/register', validateUserRegistration, validateRequest, AuthController.register);

module.exports = router;