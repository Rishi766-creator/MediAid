const mongoose = require("mongoose");

// Sub-schema for hospital specializations
const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Main Hospital schema
const hospitalSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  openingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  specializations: [specializationSchema],
});
hospitalSchema.index({ location: "2dsphere" });


const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
