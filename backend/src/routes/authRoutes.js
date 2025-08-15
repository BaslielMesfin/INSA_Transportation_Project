const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

// Create login limiter: 5 attempts per 10 minutes
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    message: 'Too many login attempts from this IP. Please try again after 10 minutes.'
  },
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false,  // Disable old X-RateLimit headers
});

router.post('/register', authController.registerUser);

// Apply limiter only on login
router.post('/login', loginLimiter, authController.loginUser);

router.post('/refresh-token', authController.refreshToken);

module.exports = router;
