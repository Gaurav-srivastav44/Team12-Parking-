import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaRupeeSign,
  FaHeart
} from "react-icons/fa";

import bg1 from "../assets/bg1.png";
import bg2 from "../assets/bg2.png";
import bg3 from "../assets/bg3.png";
import bg4 from "../assets/bg4.png";

import SlideOne from "../components/slideone";
import "./BackgroundSlider.css";
import schemesData from "../data/schemes.json";

export default function Home() {

  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const images = [bg1, bg2, bg3, bg4];
  const [current, setCurrent] = useState(0);

  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);
  const t = (en, hi) => (language === "en" ? en : hi);

  // Background Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ⭐ Fetch schemes from backend ONLY
  useEffect(() => {
    setSchemes(schemesData);
    setLoading(false);
  }, []);

  // ⭐ Smart Search & Category Filtering
  const filteredSchemes = schemes.filter((s) => {
    const name = s?.schemeName || "";
    const desc = s?.shortSchemeDesc || "";
    const categoryName = s?.schemeCategory?.[0] || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase()) ||
      categoryName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      categoryName.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Loading
  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-700">
        {t("🔄 Loading schemes…", "🔄 योजनाएँ लोड हो रही हैं…")}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600 text-xl font-semibold">
        {error}
      </div>
    );

  return (
    <div className="space-y-20">

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-4 h-[600px] overflow-hidden rounded-2xl shadow-lg">
        <SlideOne />
      </section>

      {/* ================= CATEGORIES ================= */}
      <div className="max-w-8xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#09345c] text-center mb-4">
          {t("Browse Categories", "श्रेणियाँ देखें")}
        </h2>

        <div className="flex flex-wrap justify-center gap-6 bg-[#e9f6fc] p-4 rounded-xl shadow-sm border border-[#d2e8f5]">
          {[
            "All",
            "Education",
            "Healthcare",
            "Agriculture",
            "Finance",
            "Housing",
            "Women & Child",
            "Social Welfare",
            "Employment"
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`py-2 px-5 rounded-full text-md font-semibold border transition-all duration-200 ${
                category === cat
                  ? "bg-[#09345c] text-white border-[#09345c] shadow-md"
                  : "bg-white text-[#09345c] border-[#cfe3f8] hover:bg-[#f0f8ff]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SEARCH + LIST ================= */}
      <section className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-extrabold text-center text-[#09345c] mb-8">
          {t("Explore Government Schemes", "सरकारी योजनाएँ देखें")}
        </h2>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for schemes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 border border-blue-100 rounded-xl shadow focus:ring-2 
                       focus:ring-[#7dc7e7] focus:border-[#7dc7e7] outline-none transition"
          />
        </div>

        {/* Scheme Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.slug}
              className="bg-white p-5 rounded-xl shadow-lg border border-blue-100 
                         hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h3 className="font-bold text-[#09345c] text-lg">
                {scheme.schemeName}
              </h3>

              <p className="text-sm mt-2 text-gray-600 line-clamp-3">
                {scheme.shortSchemeDesc || "No description available."}
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setSelected(scheme)}
                  className="px-4 py-2 border border-[#09345c] text-[#09345c] 
                             rounded-lg hover:bg-[#09345c] hover:text-white transition"
                >
                  Learn More
                </button>

                <a
                  href={`https://www.myscheme.gov.in/schemes/${scheme.slug}`}
                  target="_blank"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Apply
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative">
            <h3 className="text-2xl font-bold text-[#09345c]">
              {selected.schemeName}
            </h3>

            <p className="text-gray-700 mt-3 leading-relaxed">
              {selected.longSchemeDesc ||
                selected.shortSchemeDesc ||
                "No description available."}
            </p>

            <div className="mt-6 flex justify-between">
              <a
                href={`https://www.myscheme.gov.in/schemes/${selected.slug}`}
                target="_blank"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Apply Now
              </a>

              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
