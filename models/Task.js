const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"], // Ensures status can only be 'pending' or 'completed'
    default: "pending", // New tasks will automatically have 'pending' status
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // This specifies it's an ObjectId from another document
    ref: "User", // This tells Mongoose that this ObjectId refers to the 'User' model
    required: true, // A task must always be associated with a user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, which will be named 'Task' in MongoDB
module.exports = mongoose.model("Task", TaskSchema);
