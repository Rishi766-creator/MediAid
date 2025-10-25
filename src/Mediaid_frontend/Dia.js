import React, { useState, useEffect } from "react";
import doc from './doc_mov.gif';

export default function EDiagnosis() {
  const [symptoms, setSymptoms] = useState("");      
  const [duration, setDuration] = useState("");       
  const [age, setAge] = useState("");                 
  const [gender, setGender] = useState("");           
  const [results, setResults] = useState(null);      
  const [diet, setDiet] = useState("");  
  const [hospitals, setHospitals] = useState([]);    
  const [loading, setLoading] = useState(false); 

  // Fetch nearby hospitals, optional filter by specialization
  const fetchNearbyHospitals = async (specialization = "") => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          let url = `/api/hospitals?lat=${latitude}&lng=${longitude}&distance=10`; // 10 km radius
          if (specialization) url += `&specialization=${specialization}`;

          const res = await fetch(url);
          const data = await res.json();
          setHospitals(data);
        } catch (err) {
          console.error("Error fetching hospitals:", err);
        }
      }, (err) => {
        console.error("Geolocation error:", err);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Initial fetch of nearby hospitals (no specialization)
 useEffect(() => {
  setTimeout(() => fetchNearbyHospitals(), 1000);
}, []);

  // Fetch diet plan from backend AI route
  const getDietPlan = async (symptomsArray) => {
    try {
      const res = await fetch("/api/diagnosis/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomsArray }),
      });
      const data = await res.json();
      if (!data) return { recommended: [], avoid: [], tips: "" };
      if (Array.isArray(data)) return { recommended: data, avoid: [], tips: "" };
      const diet = data.dietPlan || data;
      return {
        disease: data.disease || null,
        recommended: diet.recommended || diet.Recommended || [],
        avoid: diet.avoid || diet.Avoid || [],
        tips: diet.tips || diet.Tips || "",
        _mock: data._mock || false,
      };
    } catch (err) {
      console.error("Error fetching diet plan:", err);
      return { recommended: ["Eat a balanced diet and stay hydrated."], avoid: [], tips: "" };
    }
  };

  const handleDiagnose = async () => {
    if (!symptoms || !age || !gender) {
      return alert("Please enter symptoms, age, and gender");
    }
    setLoading(true);
    setResults(null);
    setDiet("");

    try {
      const symptomsArray = symptoms.split(",").map(s => s.trim());

      // Call backend diagnosis route
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptomsArray,
          age: Number(age),
          gender
        })
      });

      const data = await res.json();
      setResults(data);

      // Extract main disease name
      const mainDisease =
        data?.result?.analysis?.possibleConditions?.[0]?.condition || null;

      // Fetch diet plan
      const dietPlan = await getDietPlan(symptomsArray);
      setDiet(dietPlan);

      // Fetch hospitals relevant to main disease
      if (mainDisease) {
        fetchNearbyHospitals(mainDisease);
      }

    } catch (err) {
      console.error(err);
      alert("Error fetching diagnosis");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-100 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 max-w-4xl">
        <div className="flex-1 flex gap-8">
          {/* Left side: form */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">eDiagnosis</h1>
            <p className="text-gray-600 mb-6">
              Identify possible diseases from symptoms, get diet tips, find doctors, and book appointments.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Symptoms (comma-separated)"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <input
                type="text"
                placeholder="Symptom Duration (optional)"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <input
                type="number"
                placeholder="Age"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <button
                className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition"
                onClick={handleDiagnose}
                disabled={loading}
              >
                {loading ? "Diagnosing..." : "Diagnose"}
              </button>
            </div>
          </div>

          {/* Right side: GIF */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <img src={doc} alt="Doctor Animation" className="w-72 h-auto" />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-6 w-full grid grid-cols-3 gap-4">
            {/* Possible Diseases */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="font-bold mb-2">Possible Diseases</h2>
              <ul>
                {results.result.analysis.possibleConditions.map((d, i) => (
                  <li key={i}>
                    {d.condition} — Risk: {d.riskLevel}
                  </li>
                ))}
              </ul>
            </div>

            {/* General Advice */}
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="font-bold mb-2">General Advice</h2>
              <ul>
                {results.result.analysis.generalAdvice.recommendedActions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            {/* Nearby Hospitals */}
            <div className="bg-purple-100 p-4 rounded-lg col-span-3 md:col-span-1">
              <h2 className="font-bold mb-2">Nearby Hospitals</h2>
              {hospitals.length === 0 ? (
                <p>Loading hospitals...</p>
              ) : (
                <ul className="space-y-2">
                  {hospitals.map((hosp) => (
                    <li key={hosp._id} className="p-2 bg-white rounded-lg shadow-sm">
                      <h3 className="font-semibold">{hosp.name}</h3>
                      <p>Phone: {hosp.phone}</p>
                      <p>
                        Hours: {hosp.openingHours.open} - {hosp.openingHours.close}
                      </p>
                      {hosp.specializations && hosp.specializations.length > 0 && (
                        <p>
                          Specializations: {hosp.specializations.map(s => s.name).join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Diet Recommendation */}
        {diet && (
          <div className="mt-6 w-full bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="font-bold mb-4 text-green-800 text-xl">
              Diet Plan & Tips for {diet?.disease || results?.result?.analysis?.possibleConditions?.[0]?.condition}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-green-700">Recommended</h3>
                {diet.recommended && diet.recommended.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {diet.recommended.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">No recommended items available.</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-green-700">Avoid</h3>
                {diet.avoid && diet.avoid.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {diet.avoid.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">No avoid items listed.</p>
                )}
              </div>
            </div>

            {diet.tips && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-700 mb-2">Health Tips:</h3>
                <p className="text-gray-700">{diet.tips}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
