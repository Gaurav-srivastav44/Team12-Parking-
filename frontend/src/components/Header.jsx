import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => {
      localStorage.removeItem("token");
      setLoggedIn(false);
      navigate("/login");
    });
  }

  function toggleLanguage() {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    window.dispatchEvent(new Event("language-change"));
  }

  const t = (en, hi) => (language === "en" ? en : hi);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
<div className="w-full px-4 md:px-6 py-3 flex items-center justify-between gap-4">

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo"
            className="w-12 md:w-16 object-contain drop-shadow-sm"
          />

          {/* Emblem + Title */}
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="India Emblem"
              className="h-8 w-8 md:h-10 md:w-10"
            />

            <div>
              <h1 className="text-lg md:text-xl font-semibold leading-tight">
                Sarkari Saathi
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Your Digital Gateway to Government Programs
              </p>
            </div>
          </div>
        </div>

        {/* CENTER NAVIGATION */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-blue-600">{t("Home","होम")}</a>
          <a href="/schemes" className="hover:text-blue-600">{t("Schemes","योजनाएँ")}</a>
          <a href="/scholarships" className="hover:text-blue-600">{t("Scholarships","छात्रवृत्तियाँ")}</a>
          <a href="/loans" className="hover:text-blue-600">{t("Loans","ऋण")}</a>
          <a href="/stories" className="hover:text-blue-600">{t("Success Stories","सफलता की कहानियाँ")}</a>
          <a href="/help" className="hover:text-blue-600">{t("Help", "सहायता")}</a>
        </nav>

        {/* RIGHT SIDE SECTION */}
        <div className="flex items-center gap-4">

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full border w-44">
            <FaSearch className="text-gray-500 text-sm" />
            <input
              type="text"
              placeholder={t("Search schemes...", "योजना खोजें...")}
              className="bg-transparent ml-2 outline-none text-sm w-full"
            />
          </div>

          {/* AUTH BUTTONS */}
         {/* AUTH BUTTONS */}
<div className="flex items-center gap-4">

  {loggedIn ? (
    <>
      {/* PROFILE ICON */}
      <a href="/profile">
        <FaUserCircle
          className="text-3xl text-gray-700 cursor-pointer hover:text-blue-600 transition"
          title={t("Profile", "प्रोफाइल")}
        />
      </a>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="px-5 py-2 bg-red-500 text-white font-medium rounded-full
                   hover:bg-red-600 transition text-sm"
      >
        {t("Logout", "लॉगआउट")}
      </button>
    </>
  ) : (
    <>
      {/* LOGIN BUTTON */}
      <button
        onClick={() => navigate("/login")}
        className="px-5 py-2 border border-[#0b4f6c] text-[#0b4f6c]
                   font-medium rounded-full hover:bg-[#0b4f6c] hover:text-white
                   transition text-sm"
      >
        {t("Login", "लॉगिन")}
      </button>

      {/* SIGNUP BUTTON */}
      <button
        onClick={() => navigate("/signup")}
        className="px-5 py-2 bg-[#0b4f6c] text-white font-medium rounded-full
                   hover:bg-[#093e56] transition text-sm"
      >
        {t("Sign Up", "रजिस्ट्रेशन")}
      </button>
    </>
  )}

  {/* LANGUAGE BUTTON */}
  <button
    onClick={toggleLanguage}
    className="px-5 py-2 bg-gray-200 text-gray-900 rounded-full text-sm
               hover:bg-gray-300 transition hidden md:block"
  >
    {language === "en" ? "हिन्दी" : "English"}
  </button>
</div>


        </div>
      </div>
    </header>
  );
}
