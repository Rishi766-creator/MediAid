import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import don from "./don_mov.gif";

export default function Find() {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(null); // tracks donor being requested

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        alert('Unable to fetch location. Please enter manually.');
        console.error(error);
      }
    );
  };

  const handleFindDonors = async () => {
    if (!bloodGroup) {
      alert('Please select a blood group.');
      return;
    }
    if (!latitude || !longitude) {
      alert('Please provide latitude and longitude (or click "Get My Location").');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/donors/nearby-donors?lat=${latitude}&lng=${longitude}&bloodGroup=${encodeURIComponent(bloodGroup)}`
      );
      setDonors(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching nearby donors.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDonor = async (donorId) => {
    const recipientName = prompt("Enter your name:");
    const recipientEmail = prompt("Enter your email:");
    if (!recipientName || !recipientEmail) return;

    try {
      setRequesting(donorId);

      // Use headers to ensure JSON is sent
      await axios.post(
        '/api/donors/request',
        { donorId, recipientName, recipientEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert('Request sent to donor. Waiting for approval.');
    } catch (err) {
      console.error(err);

      // fallback: try full URL if proxy fails
      try {
          await axios.post('/api/donors/request', { donorId, recipientName, recipientEmail });

        alert('Request sent to donor. Waiting for approval.');
      } catch (fallbackErr) {
        console.error(fallbackErr);
        alert('Error sending request. Make sure backend is running.');
      }
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-red-200 to-red-100 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 max-w-4xl">
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold text-red-900 mb-4">Find Donors</h1>
            <p className="text-gray-600 mb-6">
              Quickly locate compatible blood donors nearby and request their help safely.
            </p>

            <div className="space-y-4">
              <label className="text-xl text-gray-500">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value.trim())}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
                <option value="O-">O-</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <button
                onClick={getCurrentLocation}
                className="w-full bg-gray-200 text-gray-700 rounded-lg p-3 font-semibold hover:bg-gray-300 transition"
              >
                📍 Get My Location
              </button>

              <button
                onClick={handleFindDonors}
                className="w-full bg-red-600 text-white rounded-lg p-3 font-semibold hover:bg-red-700 transition"
              >
                {loading ? 'Finding...' : 'Find Donors'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <img src={don} alt="Doctor Animation" className="w-72 h-auto" />
            </div>
          </div>
        </div>

        {donors.length > 0 && (
          <div className="mt-6 w-full">
            <h2 className="text-2xl font-semibold text-red-700 mb-3">Nearby Donors</h2>
            <ul className="space-y-3">
              {donors.map((d, i) => (
                <li
                  key={i}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{d.name}</p>
                    <p>{d.blood_grp}</p>
                    <p>{d.distance} km away</p>
                  </div>
                  <button
                    onClick={() => handleRequestDonor(d._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={requesting === d._id}
                  >
                    {requesting === d._id ? "Requesting..." : "Request Donor"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
