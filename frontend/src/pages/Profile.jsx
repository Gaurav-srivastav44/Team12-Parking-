import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaUser,
} from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUser(data);
    }
    loadUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      
      {/* 🔵 Header with favicon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Sarkari Saathi</h1>
        </div>

        <div className="flex gap-4 text-gray-500">
          <button>Find People</button>
          <button>Messages</button>
          <button>My Contacts</button>
        </div>
      </div>

      {/* 🔵 Main Profile Layout */}
      <div className="grid grid-cols-3 gap-8">
        
        {/* LEFT SIDE */}
        <div>

          {/* Profile Image */}
          <div className="w-full flex justify-center">
            <FaUserCircle className="text-gray-400" size={110} />
          </div>


          {/* Work Section */}
          <div className="mt-5">
            <h2 className="font-semibold text-gray-700 mb-2">Work</h2>

            <div className="bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
              <p className="font-medium">Employment</p>
              <p className="text-sm text-gray-600">{user?.employment}</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="font-medium">Education</p>
              <p className="text-sm text-gray-600">{user?.education}</p>
            </div>
          </div>

          {/* Skills/Tags */}
          <div className="mt-5">
            <h2 className="font-semibold text-gray-700 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              <Tag label={user?.category} />
              <Tag label={user?.gender} />
              <Tag label={`Age: ${user?.age}`} />
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-2">
          
          {/* Name & Location */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{user?.fullName}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <FaMapMarkerAlt /> {user?.state}
              </p>
            </div>

            <button className="text-blue-600 text-sm underline">Report User</button>
          </div>

          {/* Contact + About Tabs */}
          <div className="flex gap-6 border-b mt-4 pb-1">
            <button className="text-gray-500">Timeline</button>
            <button className="text-blue-600 font-semibold border-b-2 border-blue-600">
              About
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Contact Information
            </h2>

            <Info label="Phone" value={user?.phone} icon={<FaPhone />} />
            <Info label="Email" value={user?.email} icon={<FaEnvelope />} />
            <Info label="Address" value={user?.state} icon={<FaMapMarkerAlt />} />
          </div>

          {/* Basic Information */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Basic Information
            </h2>

            <Info label="Gender" value={user?.gender} icon={<FaUser />} />
            <Info label="Age" value={user?.age} icon={<FaBirthdayCake />} />
            <Info label="Category" value={user?.category} icon={<FaUser />} />
          </div>

        </div>
      </div>
    </div>
  );
}

/* 🔵 Info Row Component */
function Info({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 py-2 text-gray-700">
      <div className="text-blue-600 text-lg">{icon}</div>
      <p className="font-medium w-32">{label}:</p>
      <p>{value || "-"}</p>
    </div>
  );
}

/* 🔵 Tag Component */
function Tag({ label }) {
  if (!label) return null;
  return (
    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
      {label}
    </span>
  );
}
