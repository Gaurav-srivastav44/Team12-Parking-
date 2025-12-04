import React, { useState, useEffect } from "react";
import { FaEye, FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function DashboardApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "rejected":
        return <FaTimesCircle className="text-red-600" />;
      case "query raised":
        return <FaExclamationTriangle className="text-orange-600" />;
      default:
        return <FaClock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "query raised":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "All") return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Application Tracker</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow">
        {["All", "Pending", "Approved", "Rejected", "Query Raised"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status} ({status === "All" ? applications.length : applications.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div
              key={app._id || app.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(app.status)}
                    <h3 className="text-xl font-bold text-gray-800">
                      {app.schemeName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Application ID</p>
                      <p className="font-semibold">{app.applicationId || `APP-${app._id?.slice(-6) || "N/A"}`}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Applied</p>
                      <p className="font-semibold">
                        {new Date(app.dateApplied || app.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </div>
                    {app.deadline && (
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-semibold">
                          {new Date(app.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {app.remarks && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Remarks:</p>
                      <p className="text-gray-800">{app.remarks}</p>
                    </div>
                  )}

                  {app.query && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-semibold text-orange-800">Query Raised:</p>
                      <p className="text-orange-700">{app.query}</p>
                      <button className="mt-2 text-sm text-blue-600 hover:underline">
                        Respond to Query
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedApp(selectedApp === app._id ? null : app._id)}
                  className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="View Details"
                >
                  <FaEye />
                </button>
              </div>

              {selectedApp === app._id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheme Category</p>
                      <p className="font-semibold">{app.category || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-semibold">
                        {new Date(app.updatedAt || app.dateApplied || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {app.documents && app.documents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-600 mb-2">Attached Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.documents.map((doc, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            <FaFileAlt className="inline mr-1" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <FaFileAlt className="text-4xl mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">No applications found.</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter !== "All"
                ? `No applications with status "${filter}".`
                : "Start applying to schemes to track your applications here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

