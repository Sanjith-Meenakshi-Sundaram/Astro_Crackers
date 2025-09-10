const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  signup,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  // THESE NEW IMPORTS
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require('../controllers/authController');

// THIS IS THE CORRECTED LINE:
// We are importing the 'auth' middleware directly, not as a named property.
const protect = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Please enter a valid Indian phone number')
], signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], login);

// @route   POST /api/auth/admin-login
// @desc    Owner/Admin login
// @access  Public
router.post('/admin-login', adminLogin);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
// The 'protect' variable now correctly holds your middleware function.
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional().isMobilePhone('en-IN').withMessage('Please enter a valid Indian phone number')
], updateProfile);

// NEW ROUTES FOR PASSWORD RESET FUNCTIONALITY

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email address')
], forgotPassword);

// @route   GET /api/auth/verify-reset-token/:token
// @desc    Verify if reset token is valid
// @access  Public
router.get('/verify-reset-token/:token', verifyResetToken);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], resetPassword);

module.exports = router;