// controllers/userController.js

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// 1️⃣ Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 2️⃣ Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, blood_grp, willing, location } = req.body;

  if (!blood_grp) {
    res.status(400);
    throw new Error("blood_grp is required");
  }

  if (typeof willing === "undefined" && typeof req.body.will === "undefined") {
    res.status(400);
    throw new Error("willing (will) is required");
  }

  if (!location || !location.latitude || !location.longitude) {
    res.status(400);
    throw new Error("location.latitude and location.longitude are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const userPayload = {
    name,
    email,
    password,
    blood_grp,
    will: willing === true || willing === "true" || willing === "yes",
    location: {
      type: "Point",
      coordinates: [Number(location.longitude), Number(location.latitude)],
    },
  };

  const user = await User.create(userPayload);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      blood_grp: user.blood_grp,
      will: user.will,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// 3️⃣ Authenticate user (login)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      blood_grp: user.blood_grp,
      will: user.will,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// 4️⃣ Get logged-in user profile
// 4️⃣ Get logged-in user profile
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    console.log("No user found in request. Token missing or invalid.");
    res.status(401);
    throw new Error("Not authorized, no user found");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    console.log("User not found in database for id:", req.user._id);
    res.status(404);
    throw new Error("User not found");
  }
});

// 5️⃣ Add disease (chronic or acute)
const addDisease = asyncHandler(async (req, res) => {
  const { type, name } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.diseases) user.diseases = [];
  user.diseases.push({ type, name });
  await user.save();
  res.json(user);
});

// 6️⃣ Add emergency contact
const addEmergencyContact = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.emergencyContacts) user.emergencyContacts = [];
  user.emergencyContacts.push({ name, phone });
  await user.save();
  res.json(user);
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  addDisease,
  addEmergencyContact,
};
