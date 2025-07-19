// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Input Validation: Basic checks for presence
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    // Input Validation: Email format (basic regex, Mongoose schema also validates)
    if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }
    // Input Validation: Password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    // 1. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    // 2. Create new user instance
    user = new User({
      name,
      email,
      password, // This will be hashed before saving
    });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    user.password = await bcrypt.hash(password, salt); // Hash the password

    // 4. Save user to database
    await user.save();

    // 5. Generate JWT
    const payload = {
      user: {
        id: user.id, // Mongoose creates an 'id' virtual property from '_id'
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: "User registered successfully!",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    // Handle specific Mongoose validation errors if needed, otherwise send 500
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    // 1. Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." }); // Use generic message for security
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. Generate JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "Logged in successfully!",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};
