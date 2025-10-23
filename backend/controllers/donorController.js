const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// GET nearby donors
const getNearbyDonors = asyncHandler(async (req, res) => {
  let { lat, lng, bloodGroup } = req.query;
  if (!lat || !lng || !bloodGroup) {
    res.status(400);
    throw new Error("Latitude, longitude, and blood group required");
  }

  lat = parseFloat(lat);
  lng = parseFloat(lng);

  const donors = await User.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distance",
        maxDistance: 500000, // ~500 km
        spherical: true,
        query: { will: true, blood_grp: bloodGroup.trim() },
      },
    },
    { $project: { _id: 1, name: 1, email: 1, blood_grp: 1, distance: 1 } },
    { $sort: { distance: 1 } },
  ]);

  res.json(donors.map(d => ({ ...d, distance: (d.distance / 1000).toFixed(2) })));
});

// POST request donor
const requestDonor = asyncHandler(async (req, res) => {
  const { donorId, recipientName, recipientEmail } = req.body;

  if (!donorId || !recipientName || !recipientEmail) {
    res.status(400);
    throw new Error("donorId, recipientName, recipientEmail required");
  }

  const donor = await User.findById(donorId);
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }

  // Save pending request in donor object
  donor.pendingRequest = { recipientName, recipientEmail };
  await donor.save();

  // Send email to donor with approval link
  const approvalLink = `${process.env.FRONTEND_URL}/donor-approve?donorId=${donor._id}`;
  await sendEmail({
    to: donor.email,
    subject: "Blood Donation Request Approval",
    text: `Hi ${donor.name},

${recipientName} has requested your help as a blood donor.

Please click below to approve or decline the request:
${approvalLink}

Thank you for your willingness to save lives!`,
  });

  res.json({ message: "Request sent to donor successfully." });
});

// POST donor approve/decline
const approveRequest = asyncHandler(async (req, res) => {
  const { donorId, approve } = req.body;

  if (!donorId || approve === undefined) {
    res.status(400);
    throw new Error("donorId and approve status required");
  }

  const donor = await User.findById(donorId);
  if (!donor || !donor.pendingRequest) {
    res.status(404);
    throw new Error("No pending request found for this donor.");
  }

  const { recipientName, recipientEmail } = donor.pendingRequest;

  if (approve) {
    await sendEmail({
      to: recipientEmail,
      subject: "Donor Approved Your Request ❤️",
      text: `Hi ${recipientName},

Good news! ${donor.name} (${donor.email}) has approved your blood donation request.

You can now contact your donor directly via email.

Stay safe and healthy!`,
    });
  } else {
    await sendEmail({
      to: recipientEmail,
      subject: "Donor Declined Your Request",
      text: `Hi ${recipientName},

Unfortunately, ${donor.name} has declined your blood donation request.

Please try searching for other donors nearby through the app.`,
    });
  }

  // Remove pending request after action
  donor.pendingRequest = undefined;
  await donor.save();

  res.json({ message: approve ? "Approved successfully" : "Declined successfully" });
});

module.exports = { getNearbyDonors, requestDonor, approveRequest };
