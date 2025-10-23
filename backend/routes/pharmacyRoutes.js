const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

// Nearby pharmacies
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const pharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          openingHours: 1,
          medicines: 1,
          location: 1,
          distance: { $divide: ["$distance", 1000] }, // convert to km
        },
      },
      { $sort: { distance: 1 } },
    ]);

    res.json(pharmacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching nearby pharmacies" });
  }
});

// ✅ Get pharmacy by ID
router.get("/:id", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching pharmacy details" });
  }
});

module.exports = router;
