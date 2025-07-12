// routes/tasks.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the JWT auth middleware
const taskController = require('../controllers/taskController'); // We'll create this next

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', authMiddleware, taskController.createTask);

module.exports = router;