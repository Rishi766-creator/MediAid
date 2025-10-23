import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("user");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newChronic, setNewChronic] = useState("");
  const [newAcute, setNewAcute] = useState("");
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  // Business states
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");
  const [pharmacyOpen, setPharmacyOpen] = useState("");
  const [pharmacyClose, setPharmacyClose] = useState("");
  const [pharmacyLocation, setPharmacyLocation] = useState({ latitude: "", longitude: "" });
  const [medicines, setMedicines] = useState([{ name: "", price: "", stock: false }]);

  const [hospitalName, setHospitalName] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalOpen, setHospitalOpen] = useState("");
  const [hospitalClose, setHospitalClose] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState({ latitude: "", longitude: "" });
  const [specializations, setSpecializations] = useState([{ name: "" }]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in!");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const addDisease = async (type) => {
    const diseaseName = type === "chronic" ? newChronic : newAcute;
    if (!diseaseName) return alert("Enter disease name");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/add-disease",
        { type, name: diseaseName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser(res.data);
      type === "chronic" ? setNewChronic("") : setNewAcute("");
    } catch (err) {
      console.error(err);
    }
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) return alert("Fill both fields");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/add-contact",
        newContact,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser(res.data);
      setNewContact({ name: "", phone: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Pharmacy
  const addPharmacy = async () => {
    if (!pharmacyName || !pharmacyPhone || !pharmacyOpen || !pharmacyClose) {
      return alert("Fill all pharmacy fields");
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/business/pharmacy",
        {
          name: pharmacyName,
          phone: pharmacyPhone,
          openingHours: { open: pharmacyOpen, close: pharmacyClose },
          location: { latitude: pharmacyLocation.latitude, longitude: pharmacyLocation.longitude },
          medicines,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Pharmacy added!");
      // Reset fields
      setPharmacyName(""); setPharmacyPhone(""); setPharmacyOpen(""); setPharmacyClose("");
      setPharmacyLocation({ latitude: "", longitude: "" });
      setMedicines([{ name: "", price: "", stock: false }]);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Hospital
  const addHospital = async () => {
    if (!hospitalName || !hospitalPhone || !hospitalOpen || !hospitalClose) {
      return alert("Fill all hospital fields");
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/business/hospital",
        {
          name: hospitalName,
          phone: hospitalPhone,
          openingHours: { open: hospitalOpen, close: hospitalClose },
          location: { latitude: hospitalLocation.latitude, longitude: hospitalLocation.longitude },
          specializations,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Hospital added!");
      // Reset fields
      setHospitalName(""); setHospitalPhone(""); setHospitalOpen(""); setHospitalClose("");
      setHospitalLocation({ latitude: "", longitude: "" });
      setSpecializations([{ name: "" }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = field === "stock" ? value : value;
    setMedicines(newMeds);
  };

  const handleSpecializationChange = (index, value) => {
    const newSpecs = [...specializations];
    newSpecs[index].name = value;
    setSpecializations(newSpecs);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="min-h-screen flex justify-center py-10 bg-gradient-to-b from-purple-100 to-purple-200">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "business" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("business")}
          >
            Business
          </button>
        </div>

        {/* USER TAB */}
        {activeTab === "user" && (
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">User Details</h2>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Blood Group:</b> {user.blood_grp}</p>
            <p><b>Will:</b> {user.will ? "Yes" : "No"}</p>

            <h3 className="mt-4 text-purple-700 font-semibold">Chronic Diseases</h3>
            <ul>{(user.diseases || []).filter(d => d.type==="chronic").map((d,i)=><li key={i}>{d.name}</li>)}</ul>
            <input value={newChronic} onChange={e=>setNewChronic(e.target.value)} placeholder="Add chronic" className="border rounded px-2 py-1" />
            <button onClick={()=>addDisease("chronic")} className="bg-purple-600 text-white px-3 py-1 rounded ml-2">Add</button>

            <h3 className="mt-4 text-purple-700 font-semibold">Acute Diseases</h3>
            <ul>{(user.diseases || []).filter(d => d.type==="acute").map((d,i)=><li key={i}>{d.name}</li>)}</ul>
            <input value={newAcute} onChange={e=>setNewAcute(e.target.value)} placeholder="Add acute" className="border rounded px-2 py-1" />
            <button onClick={()=>addDisease("acute")} className="bg-purple-600 text-white px-3 py-1 rounded ml-2">Add</button>

            <h3 className="mt-4 text-purple-700 font-semibold">Emergency Contacts</h3>
            <ul>{(user.emergencyContacts || []).map((c,i)=><li key={i}>{c.name} - {c.phone}</li>)}</ul>
            <input value={newContact.name} onChange={e=>setNewContact({...newContact, name:e.target.value})} placeholder="Name" className="border rounded px-2 py-1" />
            <input value={newContact.phone} onChange={e=>setNewContact({...newContact, phone:e.target.value})} placeholder="Phone" className="border rounded px-2 py-1 ml-2" />
            <button onClick={addContact} className="bg-purple-600 text-white px-3 py-1 rounded ml-2">Add</button>
          </div>
        )}

        {/* BUSINESS TAB */}
        {activeTab === "business" && (
          <div>
            <h2 className="text-purple-800 font-bold text-xl mb-2">Add Pharmacy</h2>
            <input placeholder="Pharmacy Name" value={pharmacyName} onChange={e=>setPharmacyName(e.target.value)} className="border rounded px-2 py-1 mb-1"/>
            <input placeholder="Phone" value={pharmacyPhone} onChange={e=>setPharmacyPhone(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Open Time" value={pharmacyOpen} onChange={e=>setPharmacyOpen(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Close Time" value={pharmacyClose} onChange={e=>setPharmacyClose(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Latitude" value={pharmacyLocation.latitude} onChange={e=>setPharmacyLocation({...pharmacyLocation, latitude:e.target.value})} className="border rounded px-2 py-1 mb-1"/>
            <input placeholder="Longitude" value={pharmacyLocation.longitude} onChange={e=>setPharmacyLocation({...pharmacyLocation, longitude:e.target.value})} className="border rounded px-2 py-1 mb-1 ml-2"/>

            <h3 className="mt-2 text-purple-700 font-semibold">Medicines</h3>
            {medicines.map((med, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input placeholder="Name" value={med.name} onChange={e=>handleMedicineChange(idx,"name",e.target.value)} className="border rounded px-2 py-1"/>
                <input placeholder="Price" value={med.price} onChange={e=>handleMedicineChange(idx,"price",e.target.value)} className="border rounded px-2 py-1"/>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={med.stock} onChange={e=>handleMedicineChange(idx,"stock",e.target.checked)} />
                  Stock
                </label>
              </div>
            ))}
            <button onClick={()=>setMedicines([...medicines,{name:"",price:"",stock:false}])} className="bg-purple-600 text-white px-3 py-1 rounded mt-1">Add Medicine</button>
            <br/>
            <button onClick={addPharmacy} className="bg-purple-700 text-white px-4 py-2 rounded mt-2">Submit Pharmacy</button>

            <h2 className="text-purple-800 font-bold text-xl mt-6 mb-2">Add Hospital</h2>
            <input placeholder="Hospital Name" value={hospitalName} onChange={e=>setHospitalName(e.target.value)} className="border rounded px-2 py-1 mb-1"/>
            <input placeholder="Phone" value={hospitalPhone} onChange={e=>setHospitalPhone(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Open Time" value={hospitalOpen} onChange={e=>setHospitalOpen(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Close Time" value={hospitalClose} onChange={e=>setHospitalClose(e.target.value)} className="border rounded px-2 py-1 mb-1 ml-2"/>
            <input placeholder="Latitude" value={hospitalLocation.latitude} onChange={e=>setHospitalLocation({...hospitalLocation, latitude:e.target.value})} className="border rounded px-2 py-1 mb-1"/>
            <input placeholder="Longitude" value={hospitalLocation.longitude} onChange={e=>setHospitalLocation({...hospitalLocation, longitude:e.target.value})} className="border rounded px-2 py-1 mb-1 ml-2"/>

            <h3 className="mt-2 text-purple-700 font-semibold">Specializations</h3>
            {specializations.map((spec, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input placeholder="Specialization" value={spec.name} onChange={e=>handleSpecializationChange(idx,e.target.value)} className="border rounded px-2 py-1"/>
              </div>
            ))}
            <button onClick={()=>setSpecializations([...specializations,{name:""}])} className="bg-purple-600 text-white px-3 py-1 rounded mt-1">Add Specialization</button>
            <br/>
            <button onClick={addHospital} className="bg-purple-700 text-white px-4 py-2 rounded mt-2">Submit Hospital</button>
          </div>
        )}
      </div>
    </div>
  );
}
