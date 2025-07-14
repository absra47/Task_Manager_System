// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token"); // Common practice to send token in 'x-auth-token' header

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information from the token payload to the request object
    // This makes user data (like user ID) available in subsequent route handlers
    req.user = decoded.user;
    next(); // Move to the next middleware/route handler
  } catch (err) {
    // Specific check for TokenExpiredError
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    // If token is not valid (e.g., expired, malformed)
    res.status(401).json({ message: "Token is not valid." });
  }
};
