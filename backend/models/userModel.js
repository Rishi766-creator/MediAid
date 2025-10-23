// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 🩺 Define sub-schemas
const diseaseSchema = new mongoose.Schema({
  type: { type: String, enum: ["chronic", "acute"], required: true },
  name: { type: String, required: true },
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["medical", "hospital"], required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

// 🧬 Sub-schema for pending donor request
const pendingRequestSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now },
});

// 🧬 Main User schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    blood_grp: { type: String, required: true },
    will: { type: Boolean, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
    },

    // 🩺 Additional fields
    diseases: [diseaseSchema],
    emergencyContacts: [contactSchema],
    businesses: [businessSchema],

    // 🩸 Field to store pending donor request
    pendingRequest: pendingRequestSchema,
  },
  {
    timestamps: true,
  }
);

// 🔒 Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🌍 GeoSpatial index for location
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
module.exports = User;
