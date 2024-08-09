const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordController = require('../controllers/passwordController');
const approvalController = require('../controllers/approvalController');
const userController = require('../controllers/userController');

// Register user
router.post('/register', authController.registerUser);

// Login user
router.post('/login', authController.loginUser);

// Check if UID exists
router.post('/check-uid', authController.checkUID);

// Forgot password
router.post('/forgot-password', passwordController.forgotPassword);

// User profile routes
router.get('/profile/:userId', userController.getUserProfile);
router.put('/profile/:userId', userController.updateUserProfile);
router.delete('/profile/:userId', userController.deleteUser);

// Approval routes
router.post('/approve', approvalController.approveUser);
router.post('/reject', approvalController.rejectUser);

module.exports = router;
