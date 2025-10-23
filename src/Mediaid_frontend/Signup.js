import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';


export default function Signup() {
   
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const [details, setDetails] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
        blood: "",
        password: "",
        confirm: "",
        will: "",
        
    });
     useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (err) => {
                console.log("Location access denied", err);
            }
        );
    } else {
        console.log("Geolocation not supported");
    }
}, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setDetails((d) => ({ ...d, [name]: value }));
    }

    async function check(e) {
        e.preventDefault();

        if (details.age && Number(details.age) < 18) {
            return setError("User should be 18 years or older");
        }
        if (!details.email) {
            return setError("Email is required");
        }
        if (!details.blood) {
            return setError("Please select your blood group");
        }
        if (!details.will) {
            return setError("Please indicate if you are willing to donate blood");
        }
        if (details.password.length < 6) {
            return setError("Password should be at least 6 characters");
        }
        if (details.password !== details.confirm) {
            return setError("Passwords do not match");
        }

        // Ensure location is provided (either from geolocation or manual input)
        if (!location || !location.latitude || !location.longitude) {
            return setError("Please provide your location (latitude and longitude)");
        }

        setError("");

        try {
            const payload = {
                name: details.name,
                email: details.email,
                password: details.password,
                blood_grp: details.blood,
                willing: details.will === 'yes' || details.will === true,
                location: {
                    latitude: Number(location.latitude),
                    longitude: Number(location.longitude),
                }
            };

            await axios.post("http://localhost:5000/api/users/register", payload);
            alert("Registered successfully!");
            navigate('/login');
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
            setError(message);
        }
    }

    return (
        <div className="bg-blue-200 backdrop-brightness-50 min-h-screen flex justify-center items-center">
            <form className="bg-white flex flex-col items-center justify-center w-full rounded-xl max-w-sm p-6" onSubmit={check}>
                <h1 className="mt-2 text-3xl mb-4">Signup</h1>
                {error && <p className="text-red-500 text-lg mb-3">{error}</p>}

                <input type="text" placeholder="Name" name="name" value={details.name} className="mb-3 p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" onChange={handleChange} />
                <input type="email" placeholder="Email" name="email" value={details.email} className="mb-3 p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" onChange={handleChange} />
                <input type="number" placeholder="Age" name="age" value={details.age} className="mb-3 p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" onChange={handleChange} />

                <div className="flex flex-row gap-2 mb-3">
                    <label className="flex gap-1 items-center"><input type="radio" name="gender" value="male" checked={details.gender === 'male'} onChange={handleChange} /> Male</label>
                    <label className="flex gap-1 items-center"><input type="radio" name="gender" value="female" checked={details.gender === 'female'} onChange={handleChange} /> Female</label>
                    <label className="flex gap-1 items-center"><input type="radio" name="gender" value="other" checked={details.gender === 'other'} onChange={handleChange} /> Other</label>
                </div>

                <select className="w-1/2 mb-3 p-2" onChange={handleChange} name="blood" value={details.blood}>
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>

                <input type="password" placeholder="Password" name="password" value={details.password} onChange={handleChange} className="mb-3 p-2 w-full" />
                <input type="password" placeholder="Confirm Password" name="confirm" value={details.confirm} onChange={handleChange} className="mb-3 p-2 w-full" />

                <p className="mb-2">Willing to donate blood?</p>
                <div className="flex gap-2 mb-4">
                    <label className="flex gap-1 items-center"><input type="radio" name="will" value="yes" checked={details.will === 'yes'} onChange={handleChange} /> Yes</label>
                    <label className="flex gap-1 items-center"><input type="radio" name="will" value="no" checked={details.will === 'no'} onChange={handleChange} /> No</label>
                </div>

                <div className="w-full mb-3">
                    <label className="block text-sm mb-1">Location (latitude)</label>
                    <input type="number" step="any" placeholder="Latitude" value={location.latitude || ''} onChange={(e) => setLocation(l => ({ ...l, latitude: e.target.value }))} className="mb-2 p-2 w-full" />
                    <label className="block text-sm mb-1">Location (longitude)</label>
                    <input type="number" step="any" placeholder="Longitude" value={location.longitude || ''} onChange={(e) => setLocation(l => ({ ...l, longitude: e.target.value }))} className="mb-2 p-2 w-full" />
                </div>

                <button type="submit" className="w-1/2 bg-blue-400 mb-4 h-9 rounded">Signup</button>
            </form>
        </div>
    );
}