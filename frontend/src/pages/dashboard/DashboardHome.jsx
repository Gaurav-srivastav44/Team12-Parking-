import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  // Load user profile
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    }
    loadUser();
  }, []);

  // Load schemes
  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await fetch("http://localhost:5000/api/schemes");
        const data = await res.json();
        setAllSchemes(data);
        // Simple recommendation logic
        setRecommended(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load schemes:", err);
      }
    }
    loadSchemes();
  }, []);

  // Load applications
  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("http://localhost:5000/api/applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    }
    loadApplications();
  }, []);

  // Filter schemes based on search
  const filteredSchemes = allSchemes.filter((scheme) =>
    scheme.schemeName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      case "query raised":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex-1 p-10">
      {/* Search Bar */}
      <div className="flex items-center bg-white p-4 rounded-2xl shadow">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search Schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Welcome Section */}
      <div className="mt-6 bg-white p-6 rounded-3xl shadow flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Hello, {user?.fullName || "User"}!
          </h2>
          <p className="text-gray-600 mt-1">
            Your journey to government benefits starts here.
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/dashboard/schemes")}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Find New Schemes
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl shadow text-gray-700">
          <h3 className="font-semibold mb-2">Status Overview</h3>
          <p>Applications Pending: {applications.filter(a => a.status === "Pending").length}</p>
          <p>Schemes Applied For: {applications.length}</p>
          <p>Approved: {applications.filter(a => a.status === "Approved").length}</p>
          <p>Upcoming Deadlines: {applications.filter(a => a.deadline && new Date(a.deadline) > new Date()).length}</p>
        </div>
      </div>

      {/* Recommended Schemes */}
      <div className="mt-8 bg-white p-6 rounded-3xl shadow">
        <h3 className="text-xl font-semibold mb-4">Recommended Schemes</h3>

        {/* Recommendation Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommended.map((scheme, index) => (
            <div
              key={scheme.id}
              className={`p-5 rounded-xl text-white shadow-lg cursor-pointer hover:scale-105 transition ${
                index === 0
                  ? "bg-green-600"
                  : index === 1
                  ? "bg-blue-600"
                  : "bg-indigo-500"
              }`}
              onClick={() => navigate("/dashboard/schemes")}
            >
              <h4 className="font-bold">{scheme.schemeName}</h4>
              <p className="text-sm opacity-90 mt-2">Benefit: {scheme.benefits}</p>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="mt-6 overflow-hidden rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-4">Your Applications</h3>
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3">Scheme Name</th>
                <th className="p-3">Application ID</th>
                <th className="p-3">Date Applied</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((app, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">{app.schemeName}</td>
                    <td className="p-3">{app.applicationId || `APP-${idx + 1}`}</td>
                    <td className="p-3">{new Date(app.dateApplied || Date.now()).toLocaleDateString()}</td>
                    <td className={`p-3 font-medium ${getStatusColor(app.status)}`}>
                      {app.status || "Pending"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate("/dashboard/applications")}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No applications yet. <button onClick={() => navigate("/dashboard/schemes")} className="text-blue-600 hover:underline">Browse schemes</button> to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Documents */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts Box */}
        <div className="bg-yellow-100 p-6 rounded-3xl border shadow">
          <h3 className="font-semibold text-gray-800 mb-3">
            Important Alerts & Notifications
          </h3>

          <ul className="list-disc ml-5 text-gray-700 space-y-2">
            {applications.filter(a => a.status === "Query Raised").length > 0 ? (
              applications
                .filter(a => a.status === "Query Raised")
                .map((app, idx) => (
                  <li key={idx}>
                    Query raised for {app.schemeName}. Please respond.
                  </li>
                ))
            ) : (
              <li>No pending alerts at this time.</li>
            )}
          </ul>
        </div>

        {/* Document Snapshot */}
        <div className="bg-blue-100 p-6 rounded-3xl border shadow">
          <h3 className="font-semibold text-gray-800 mb-3">
            Document Management Snapshot
          </h3>

          <p className="text-gray-700 mb-4">
            Manage your documents to speed up application processing.
          </p>

          <button
            onClick={() => navigate("/dashboard/documents")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Go to Documents Vault
          </button>
        </div>
      </div>
    </div>
  );
}

