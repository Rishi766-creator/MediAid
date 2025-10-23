// routes/donorRoutes.js
const express = require("express");
const { getNearbyDonors, requestDonor, approveRequest } = require("../controllers/donorController");

const router = express.Router();

// GET nearby donors
router.get("/nearby-donors", getNearbyDonors);

// POST request donor
router.post("/request", requestDonor);

// POST donor approve/decline
router.post("/approve", approveRequest);

module.exports = router;
