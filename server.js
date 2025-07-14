require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // We'll create this next
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // Allows us to get data in req.body
app.use(cors()); // Enable CORS for all origins

app.get("/", (req, res) => {
  res.send("API Running");
});

// Define Routes (we'll add these later)

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));

// --- Error Handling Middleware ---
// Must be placed AFTER all routes
app.use(notFound); // Catches 404s for undefined routes
app.use(errorHandler); // Catches all other errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
