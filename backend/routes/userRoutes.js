const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  addDisease,
  addEmergencyContact,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);

// Protected routes
router.get("/me", protect, getUserProfile);
router.post("/add-disease", protect, addDisease);
router.post("/add-contact", protect, addEmergencyContact);

module.exports = router;
