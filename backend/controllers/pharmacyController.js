const asyncHandler = require("express-async-handler");
const Pharmacy = require("../models/Pharmacy");

// Get nearby pharmacies
const getNearbyPharmacies = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    res.status(400);
    throw new Error("Latitude and longitude are required");
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
      $match: {
        distance: { $lte: 5000 }, // within 5 km
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
});

// Get pharmacy details by ID
const getPharmacyById = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findById(req.params.id);
  if (!pharmacy) {
    res.status(404);
    throw new Error("Pharmacy not found");
  }
  res.json(pharmacy);
});

module.exports = { getNearbyPharmacies, getPharmacyById };
