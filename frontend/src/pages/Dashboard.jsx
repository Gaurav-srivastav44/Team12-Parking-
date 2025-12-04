import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaFileAlt,
  FaQuestionCircle,
  FaUserCircle,
  FaFolderOpen,
  FaClipboardList,
} from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.log("User fetch error:", err);
        navigate("/login");
      }
    }
    loadUser();
  }, [navigate]);

  // Redirect to home if on base dashboard route
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/home", { replace: true });
    }
  }, [location.pathname, navigate]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#eef6ff]">
      {/* ====================== SIDEBAR ====================== */}
      <div className="w-64 bg-white shadow-xl p-6 flex flex-col gap-6 rounded-r-3xl">
        <h1 className="text-2xl font-bold text-blue-700">Sarkari Sathi</h1>

        <div className="flex flex-col gap-2 mt-4">
          <Link
            to="/dashboard/home"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/dashboard/home")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaHome /> Home
          </Link>

          <Link
            to="/dashboard/schemes"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/dashboard/schemes")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaFileAlt /> Schemes
          </Link>

          <Link
            to="/dashboard/applications"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/dashboard/applications")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaClipboardList /> Applications
          </Link>

          <Link
            to="/dashboard/documents"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/dashboard/documents")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaFolderOpen /> Documents
          </Link>

          <Link
            to="/help"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/help")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaQuestionCircle /> Help
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive("/profile")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaUserCircle /> Profile
          </Link>
        </div>
      </div>

      {/* ====================== MAIN AREA ====================== */}
      <div className="flex-1 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
