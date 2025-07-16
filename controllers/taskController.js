// controllers/taskController.js
const Task = require("../models/Task"); // Import the Task model

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
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
    next(err);
  }
};
// @desc    Get all tasks for the authenticated user with pagination and search
// @route   GET /api/tasks?page=<number>&limit=<number>
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    // Extract pagination parameters from query string
    // Convert to number, default to 1 for page and 10 for limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Extract search query parameter
    const search = req.query.search;

    // Build query object for the authenticated user
    const query = { user: req.user.id };

    // Add search condition if 'search' parameter is provided
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive partial match
    }

    // Get total number of tasks matching the query for pagination metadata
    const totalTasks = await Task.countDocuments(query);

    // Get tasks with skip and limit, sorted by creation date
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);

    // Respond with tasks and pagination metadata
    res.json({
      tasks,
      pagination: {
        totalTasks,
        currentPage: page,
        totalPages,
        limit,
        // Optional: Include next/prev page links if needed by frontend
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err); // Pass to global error handler for 500
  }
};

// @desc    Update task status (pending / completed)
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  const { id } = req.params; // Get task ID from URL parameters
  const { status } = req.body; // Get new status from request body

  // 1. Validate status input
  const validStatuses = ["pending", "completed"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
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
    next(err);
  }
};
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  const { id } = req.params; // Get task ID from URL parameters

  try {
    // 1. Find the task by ID and ensure it belongs to the authenticated user
    // Using findOneAndDelete to find and delete in one operation
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      // If task not found OR task does not belong to user
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized to delete." });
    }

    // 2. Respond with success message
    res.json({ message: "Task deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    // Handle specific Mongoose error for invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }
    next(err);
  }
};
