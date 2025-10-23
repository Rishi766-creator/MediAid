const asyncHandler = require("express-async-handler");
const Pharmacy = require("../models/Pharmacy");
const Hospital = require("../models/hospitalModel");

// ✅ Add pharmacy
const addPharmacy = asyncHandler(async (req, res) => {
  const { name, phone, openingHours, location, medicines } = req.body;

  const pharmacy = await Pharmacy.create({
    name,
    phone,
    openingHours,
    location: {
      type: "Point",
      coordinates: [Number(location.longitude), Number(location.latitude)],
    },
    medicines, // array of { name, price, stock }
  });

  res.status(201).json(pharmacy);
});

// ✅ Add hospital
const addHospital = asyncHandler(async (req, res) => {
  const { name, phone, openingHours, location, specializations } = req.body;

  const hospital = await Hospital.create({
    name,
    phone,
    openingHours,
    location: {
      type: "Point",
      coordinates: [Number(location.longitude), Number(location.latitude)],
    },
    specializations, // array of { name }
  });

  res.status(201).json(hospital);
});

// ✅ Get nearby pharmacies based on user's coordinates
const getNearbyPharmacies = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // [lng, lat]
          },
          $maxDistance: 5000, // 5 km radius
        },
      },
    });

    res.status(200).json(pharmacies);
  } catch (error) {
    console.error("Error fetching nearby pharmacies:", error);
    res.status(500).json({ message: "Server error fetching nearby pharmacies" });
  }
});

module.exports = { addPharmacy, addHospital, getNearbyPharmacies };
