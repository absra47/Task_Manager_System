// controllers/userController.js
const User = require('../models/User'); // Import the User model

// @desc    Get authenticated user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // req.user.id is populated by our authMiddleware after successful token verification
    // Select name and email fields, exclude password and other sensitive data
    const user = await User.findById(req.user.id).select('name email -_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};