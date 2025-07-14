// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Determine the status code based on existing response status or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  res.json({
    message: err.message,
    // In development, send the stack trace for debugging
    // In production, you might want to omit the stack trace for security
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
