import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function DonorApprove() {
  const [searchParams] = useSearchParams();
  const donorId = searchParams.get("donorId");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!donorId) return;

    // Optionally fetch donor info (name) from backend
  }, [donorId]);

  const handleApprove = async () => {
    try {
      await axios.post(`/api/donors/approve`, { donorId, approve: true });
      setStatus("approved");
    } catch (err) {
      console.error(err);
      alert("Error approving request");
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post(`/api/donors/approve`, { donorId, approve: false });
      setStatus("declined");
    } catch (err) {
      console.error(err);
      alert("Error declining request");
    }
  };

  if (!donorId) return <p>Invalid approval link.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        {status === "pending" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Blood Donation Request</h1>
            <p className="mb-6">Do you want to approve this donation request?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Decline
              </button>
            </div>
          </>
        )}

        {status === "approved" && <p className="text-green-600 font-semibold">You have approved the request.</p>}
        {status === "declined" && <p className="text-red-600 font-semibold">You have declined the request.</p>}
      </div>
    </div>
  );
}
