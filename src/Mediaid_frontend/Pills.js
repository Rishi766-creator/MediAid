import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import phar from "./phar_mov.gif";
import axios from "axios";

export default function Pills() {
  const Navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  function back() {
    Navigate("/");
  }

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
          alert("📍 Location captured successfully!");
        },
        () => {
          alert("Unable to get location!");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation not supported!");
      setLoading(false);
    }
  };

  const findNearbyPharmacies = async () => {
    if (!location) {
      alert("Please capture location first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pharmacy/nearby?lat=${location.lat}&lng=${location.lng}`
      );
      setPharmacies(res.data);
    } catch (err) {
      console.error("Error fetching nearby pharmacies:", err);
      alert("Error fetching nearby pharmacies");
    }
    setLoading(false);
  };

  const viewPharmacyDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pharmacy/${id}`);
      setSelectedPharmacy(res.data);
    } catch (err) {
      console.error("Error fetching pharmacy details:", err);
      alert("Error fetching pharmacy details");
    }
  };

  return (
    <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 max-w-4xl w-full">
        <div className="flex-1 flex">
          {/* Left side */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold text-yellow-900 mb-4">ePharmacy</h1>
            <p className="text-gray-600 mb-6">
              Find nearby pharmacies and check medicine availability.
            </p>

            <div className="space-y-4">
              <button
                onClick={getLocation}
                className="w-full bg-gray-200 text-gray-900 rounded-lg p-3 font-semibold hover:bg-gray-400 transition"
              >
                {loading ? " Getting Location..." : " Use My Location"}
              </button>

              <button
                onClick={findNearbyPharmacies}
                className="w-full bg-yellow-600 text-white rounded-lg p-3 font-semibold hover:bg-yellow-900 transition"
              >
                {loading ? " Searching..." : "Find Nearby Pharmacies"}
              </button>
            </div>

            {/* Nearby pharmacies */}
            {pharmacies.length > 0 && !selectedPharmacy && (
              <div className="w-full mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
                <h2 className="text-lg font-semibold text-yellow-800 mb-3">
                  Nearby Pharmacies
                </h2>
                <ul className="space-y-3">
                  {pharmacies.map((ph) => (
                    <li
                      key={ph._id}
                      className="border border-gray-300 p-3 rounded-lg hover:bg-yellow-50 transition cursor-pointer"
                      onClick={() => viewPharmacyDetails(ph._id)}
                    >
                      <div className="font-semibold text-yellow-700">{ph.name}</div>
                      <div className="text-sm text-gray-600">
                        📞 {ph.phone} <br />
                        🕒 {ph.openingHours.open} - {ph.openingHours.close}
                      </div>
                      <div className="text-sm text-gray-500">
                        🧭 {(ph.distance / 1000).toFixed(2)} km away
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selected pharmacy details */}
            {selectedPharmacy && (
              <div className="w-full mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
                <button
                  className="mb-3 text-sm text-blue-500"
                  onClick={() => setSelectedPharmacy(null)}
                >
                  ← Back to list
                </button>
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                  {selectedPharmacy.name}
                </h2>
                <div className="text-sm text-gray-600 mb-2">
                  📞 {selectedPharmacy.phone} <br />
                  🕒 {selectedPharmacy.openingHours.open} - {selectedPharmacy.openingHours.close}
                </div>
                <h3 className="font-semibold text-yellow-700 mb-2">Medicines</h3>
                <ul className="space-y-1">
                  {selectedPharmacy.medicines.map((med, i) => (
                    <li key={i} className="text-sm">
                      {med.name} - ₹{med.price} -{" "}
                      {med.stock ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right side GIF */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <img src={phar} alt="Pharmacy Animation" className="w-72 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
