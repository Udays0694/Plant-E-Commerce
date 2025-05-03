// routes/userRoutes.js
const express = require('express');
const authenticate = require('../middlewares/authMiddleware');  // Authentication middleware
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');

const router = express.Router();

console.log('User routes loaded');  // Log this message to confirm the routes file is being loaded

// Define the route for fetching the user profile
router.get('/profile', authenticate, getUserProfile);

// Protected route for updating the user profile
router.put('/profile', authenticate, updateUserProfile);

module.exports = router;

