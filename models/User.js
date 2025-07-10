const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Remove whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique (no two users can have the same email)
    lowercase: true, // Store emails in lowercase to ensure uniqueness checks are case-insensitive
    trim: true,
    match: [
      /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please fill a valid email address",
    ], // Basic email regex validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // A common minimum length for passwords
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Export the model, which will be named 'User' in MongoDB
module.exports = mongoose.model("User", UserSchema);
