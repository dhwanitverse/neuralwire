const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  validateResetToken,
  resetPassword,
  googleOAuthInit,
  googleOAuthCallback,
  googleOAuthStatus,
  testEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { forgotPasswordIpLimiter, forgotPasswordEmailLimiter, resetTokenLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Local auth
router.post('/register', register);
router.post('/login', login);
router.get('/test-email', testEmail);
router.post('/forgot-password', forgotPasswordIpLimiter, forgotPasswordEmailLimiter, forgotPassword);
router.get('/reset-password/:token', resetTokenLimiter, validateResetToken);
router.post('/reset-password/:token', resetTokenLimiter, resetPassword);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google/status', googleOAuthStatus);
router.get('/google', googleOAuthInit);
router.get('/google/callback', googleOAuthCallback);

module.exports = router;
