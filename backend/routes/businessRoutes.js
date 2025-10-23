const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addPharmacy, addHospital } = require("../controllers/businessController");
const Pharmacy = require("../models/Pharmacy");

// ✅ Add new pharmacy
router.post("/pharmacy", protect, addPharmacy);

// ✅ Add new hospital
router.post("/hospital", protect, addHospital);

// ✅ Get nearby pharmacies based on user’s current location
router.get("/pharmacies/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const pharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          maxDistance: 5000, // 5km radius
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          openingHours: 1,
          medicines: 1,
          distance: 1,
        },
      },
    ]);

    res.json(pharmacies);
  } catch (error) {
    console.error("Error fetching nearby pharmacies:", error);
    res.status(500).json({ message: "Server error while fetching pharmacies" });
  }
});

module.exports = router;
