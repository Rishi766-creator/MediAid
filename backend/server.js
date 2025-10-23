// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Routes
const userRoutes = require("./routes/userRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const donorRoutes = require("./routes/donorRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const businessRoutes = require("./routes/businessRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const User = require("./models/userModel");

// Initialize app
const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(express.json());

// ✅ CORS setup for frontend
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// Default route
app.get("/", (req, res) => {
  res.send("MediaID Backend is running...");
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Auth middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Profile routes example
app.get("/api/users/me", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}));

// Error handler
app.use((err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
