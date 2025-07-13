// controllers/taskController.js
const Task = require("../models/Task"); // Import the Task model

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  const { name } = req.body;

  try {
    // Basic validation: Check if task name is provided
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Task name is required." });
    }

    const newTask = new Task({
      name,
      // Status defaults to 'pending' as defined in models/Task.js schema
      user: req.user.id, // Associate task with the authenticated user's ID
    });

    const task = await newTask.save(); // Save the new task to the database

    res.status(201).json(task); // Respond with the created task (HTTP 201 Created)
  } catch (err) {
    console.error(err.message);
    // Handle Mongoose validation errors (e.g., if status somehow gets invalid value, though enum prevents this here)
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).send("Server Error");
  }
};
exports.getTasks = async (req, res) => {
  try {
    // Find all tasks where the 'user' field matches the authenticated user's ID
    // Sort them by 'createdAt' in descending order (latest first)
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(tasks); // Respond with the array of tasks
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// @desc    Update task status (pending / completed)
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params; // Get task ID from URL parameters
  const { status } = req.body; // Get new status from request body

  // 1. Validate status input
  const validStatuses = ["pending", "completed"];
  if (!status || !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: 'Invalid status provided. Must be "pending" or "completed".',
      });
  }

  try {
    // 2. Find the task by ID and ensure it belongs to the authenticated user
    let task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      // If task not found OR task does not belong to user
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized." });
    }

    // 3. Update the task status
    task.status = status;

    // 4. Save the updated task
    await task.save();

    res.json({ message: "Task status updated successfully.", task }); // Respond with success message and updated task
  } catch (err) {
    console.error(err.message);
    // Handle specific Mongoose error for invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }
    res.status(500).send("Server Error");
  }
};
