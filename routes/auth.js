// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // We'll create this next

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post("/signup", authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", authController.login);

module.exports = router;
