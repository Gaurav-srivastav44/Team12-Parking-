import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import Logo from "../assets/logo/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);

  const t = (en, hi) => (language === "en" ? en : hi);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save JWT Token
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#dff0ff] flex justify-center items-center relative overflow-hidden">

      {/* BIG BLURRED BACKGROUND LOGO */}
      <img
        src={Logo}
        alt="blurred logo"
        className="absolute w-[65%] opacity-20 blur-2xl select-none pointer-events-none"
      />

      {/* LOGIN CARD */}
      <div className="relative bg-white/80 backdrop-blur-2xl shadow-xl border border-white/40 p-10 rounded-3xl w-full max-w-lg z-10">

        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <img src={Logo} alt="Logo" className="w-40 drop-shadow-md" />
        </div>

        <h1 className="text-center text-xl font-semibold text-gray-700 mb-8">
          {t("Find Your Perfect Parking Spot", "अपनी पार्किंग जगह खोजें")}
        </h1>

        {error && (
          <p className="text-center text-red-600 bg-red-100 py-2 rounded mb-4">
            {t("Invalid username or password", "अमान्य उपयोगकर्ता नाम या पासवर्ड")}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="relative mb-6">
            <FaUser className="absolute left-3 top-4 text-gray-500" />
            <input
              type="text"
              className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t("Username", "उपयोगकर्ता नाम")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-4 text-gray-500" />
            <input
              type="password"
              className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t("Password", "पासवर्ड")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition active:scale-95"
          >
            {t("Login", "लॉगिन")} <FaArrowRight />
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-700 font-bold hover:underline">
            Sign Up
          </a>
        </p>

      </div>
    </div>
  );
}
