// controllers/taskController.js
const Task = require('../models/Task'); // Import the Task model

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  const { name } = req.body;

  try {
    // Basic validation: Check if task name is provided
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Task name is required.' });
    }

    const newTask = new Task({
      name, 
      // Status defaults to 'pending' as defined in models/Task.js schema
      user: req.user.id // Associate task with the authenticated user's ID
    });

    const task = await newTask.save(); // Save the new task to the database

    res.status(201).json(task); // Respond with the created task (HTTP 201 Created)

  } catch (err) {
    console.error(err.message);
    // Handle Mongoose validation errors (e.g., if status somehow gets invalid value, though enum prevents this here)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
};