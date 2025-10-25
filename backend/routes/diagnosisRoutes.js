// diagnosisRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// 🩺 POST /api/diagnosis — main RapidAPI diagnosis
router.post("/", async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    if (!symptoms || symptoms.length === 0 || !age || !gender) {
      return res.status(400).json({ message: "Symptoms, age, and gender are required" });
    }

    const requestBody = {
      symptoms,
      patientInfo: { age, gender },
      lang: "en",
    };

    const response = await axios.post(
      "https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose?noqueue=1",
      requestBody,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Diagnosis API error" });
  }
});


// 🥗 POST /api/diagnosis/diet — fetch diet plan from dietData.json
router.post("/diet", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "Symptoms required" });
    }

    // Load diet data
    const dietPath = path.join(__dirname, "../data/dietData.json");
    const dietFile = fs.readFileSync(dietPath, "utf-8");
    const dietData = JSON.parse(dietFile);

    // Try to match any disease from symptoms
    const foundDisease = Object.keys(dietData).find((key) =>
      symptoms.some((s) => key.toLowerCase().includes(s.toLowerCase()))
    );

    const diseaseKey = foundDisease || "Default";
    const dietPlan = dietData[diseaseKey];

    res.json({ disease: diseaseKey, dietPlan });
  } catch (err) {
    console.error("Diet fetch error:", err);
    res.status(500).json({ message: "Server error while fetching diet plan" });
  }
});

module.exports = router;
