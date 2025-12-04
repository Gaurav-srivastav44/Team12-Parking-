import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="bg-white/90 backdrop-blur-sm shadow-md border-b sticky top-0 z-50">
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-4 cursor-pointer"
             onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
            className="w-12 md:w-14 object-contain drop-shadow-sm"
          />

          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="India Emblem"
              className="h-8 w-8 md:h-10 md:w-10"
            />

            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#0b4f6c]">
                Sarkari Saathi
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Your Digital Gateway to Government Programs
              </p>
            </div>
          </div>
        </div>

        {/* CENTER NAV - DESKTOP */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-blue-600 transition">{t("Home","होम")}</a>
          <a href="/schemes" className="hover:text-blue-600 transition">{t("Schemes","योजनाएँ")}</a>
          <a href="/scholarships" className="hover:text-blue-600 transition">{t("Scholarships","छात्रवृत्तियाँ")}</a>
          <a href="/loans" className="hover:text-blue-600 transition">{t("Loans","ऋण")}</a>
          <a href="/stories" className="hover:text-blue-600 transition">{t("Success Stories","सफलता की कहानियाँ")}</a>
          <a href="/help" className="hover:text-blue-600 transition">{t("Help","सहायता")}</a>
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* Search Bar (Desktop Only) */}
          <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full border w-52 shadow-sm">
            <FaSearch className="text-gray-500 text-sm" />
            <input
              type="text"
              placeholder={t("Search schemes...", "योजना खोजें...")}
              className="bg-transparent ml-2 outline-none text-sm w-full"
            />
          </div>

          {/* Auth Buttons + Language Toggle */}
          <div className="hidden md:flex items-center gap-4">

            {loggedIn ? (
              <>
                <a href="/profile">
                  <FaUserCircle
                    className="text-3xl text-gray-700 cursor-pointer hover:text-blue-600 transition"
                    title={t("Profile","प्रोफाइल")}
                  />
                </a>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
                >
                  {t("Logout","लॉगआउट")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 border border-[#0b4f6c] text-[#0b4f6c] rounded-full text-sm font-medium hover:bg-[#0b4f6c] hover:text-white transition"
                >
                  {t("Login","लॉगिन")}
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-[#0b4f6c] text-white rounded-full text-sm font-medium hover:bg-[#093e56] transition"
                >
                  {t("Sign Up","रजिस्ट्रेशन")}
                </button>
              </>
            )}

            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition"
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md p-4 space-y-4">

          <div className="flex flex-col gap-3 text-gray-700 font-medium">
            <a href="/" className="hover:text-blue-600">{t("Home","होम")}</a>
            <a href="/schemes" className="hover:text-blue-600">{t("Schemes","योजनाएँ")}</a>
            <a href="/scholarships" className="hover:text-blue-600">{t("Scholarships","छात्रवृत्तियाँ")}</a>
            <a href="/loans" className="hover:text-blue-600">{t("Loans","ऋण")}</a>
            <a href="/stories" className="hover:text-blue-600">{t("Success Stories","सफलता की कहानियाँ")}</a>
            <a href="/help" className="hover:text-blue-600">{t("Help","सहायता")}</a>
          </div>

          {/* Auth Section */}
          <div className="pt-3 border-t flex flex-col gap-3">

            {loggedIn ? (
              <>
                <a href="/profile" className="flex items-center gap-2 text-gray-700">
                  <FaUserCircle className="text-2xl" />
                  {t("Profile","प्रोफाइल")}
                </a>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                >
                  {t("Logout","लॉगआउट")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2 border border-[#0b4f6c] text-[#0b4f6c] rounded-lg font-medium hover:bg-[#0b4f6c] hover:text-white transition"
                >
                  {t("Login","लॉगिन")}
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="w-full py-2 bg-[#0b4f6c] text-white rounded-lg font-medium hover:bg-[#093e56] transition"
                >
                  {t("Sign Up","रजिस्ट्रेशन")}
                </button>
              </>
            )}

            <button
              onClick={toggleLanguage}
              className="w-full py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
