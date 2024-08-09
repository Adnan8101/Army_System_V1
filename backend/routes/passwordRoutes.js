const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Forgot password
router.post('/forgot-password', passwordController.forgotPassword);

// Verify OTP
router.post('/verify-otp', passwordController.verifyOTP);

// Reset password
router.post('/reset', passwordController.resetPassword);

module.exports = router;
