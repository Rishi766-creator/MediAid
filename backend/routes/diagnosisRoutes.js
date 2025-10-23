const express = require("express");
const axios = require("axios");
const router = express.Router();



// POST /api/diagnosis — RapidAPI
router.post("/", async (req, res) => {
    try {
        const { symptoms, age, gender } = req.body;

        if (!symptoms || symptoms.length === 0 || !age || !gender) {
            return res.status(400).json({ message: "Symptoms, age, and gender are required" });
        }

        const requestBody = {
            symptoms,
            patientInfo: { age, gender },
            lang: "en"
        };

        const response = await axios.post(
            "https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose?noqueue=1",
            requestBody,
            {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: "Diagnosis API error" });
    }
});


module.exports = router;
