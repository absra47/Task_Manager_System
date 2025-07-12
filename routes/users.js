// routes/users.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import our JWT authentication middleware
const userController = require('../controllers/userController'); // We'll create this next

// @route   GET /api/profile
// @desc    Get authenticated user's profile (name and email)
// @access  Private (requires JWT)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;    