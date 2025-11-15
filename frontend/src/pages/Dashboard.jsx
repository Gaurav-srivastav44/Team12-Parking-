import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";

export default function Dashboard() {
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);

  const t = (en, hi) => (language === "en" ? en : hi);

  // Load schemes from backend
  useEffect(() => {
    async function fetchSchemes() {
      const res = await fetch("http://localhost:5000/api/schemes");
      const data = await res.json();

      setAllSchemes(data.schemes);
      setFilteredSchemes(data.schemes);

      const uniqueCats = [...new Set(data.schemes.map((s) => s.category))];
      setCategories(uniqueCats);
    }

    fetchSchemes();
  }, []);

  // Search Filter
  useEffect(() => {
    let result = [...allSchemes];

    // Apply search
    if (search) {
      result = result.filter((s) =>
        s.schemeName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filtering
    if (selectedCats.length > 0) {
      result = result.filter((s) => selectedCats.includes(s.category));
    }

    setFilteredSchemes(result);
  }, [search, selectedCats, allSchemes]);

  // Handle category checkbox
  const handleCategoryChange = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl p-5 w-64 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Filters
        </h2>

        <h3 className="text-gray-700 font-semibold mb-2">Categories</h3>

        <div className="space-y-2">
          {categories.map((cat, i) => (
            <label key={i} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedCats([]);
            setSearch("");
            setFilteredSchemes(allSchemes);
          }}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="md:hidden p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={20} />
          </button>

          <div className="flex-1 ml-3 relative max-w-lg">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search schemes..."
              className="w-full bg-white p-3 pl-10 rounded-xl shadow border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Showing {filteredSchemes.length} Schemes
        </h2>

        <div className="space-y-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {scheme.schemeName}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                Category:{" "}
                <span className="font-semibold">{scheme.category}</span>
              </p>

              <p className="text-gray-700 mb-3">{scheme.description}</p>

              <a
                href={scheme.applyUrl}
                target="_blank"
                className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
