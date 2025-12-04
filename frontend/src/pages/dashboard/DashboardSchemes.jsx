import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function DashboardSchemes() {
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await fetch("http://localhost:5000/api/schemes");
        const data = await res.json();
        setAllSchemes(data);
        setFilteredSchemes(data);
        
        // Extract unique categories
        const uniqueCats = [...new Set(data.map(s => s.category).filter(Boolean))];
        setCategories(uniqueCats);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load schemes:", err);
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  // Filter schemes
  useEffect(() => {
    let filtered = [...allSchemes];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.schemeName?.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    setFilteredSchemes(filtered);
  }, [search, selectedCategory, allSchemes]);

  const handleApply = async (scheme) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schemeId: scheme.id,
          schemeName: scheme.schemeName,
          category: scheme.category,
        }),
      });

      if (res.ok) {
        alert(`Application started for ${scheme.schemeName}`);
        // Optionally refresh applications list
      } else {
        alert("Failed to start application. Please try again.");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading schemes...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse Schemes</h2>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-gray-50 p-3 rounded-xl">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 p-3 rounded-xl border outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""}
      </p>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <div className="mb-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {scheme.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {scheme.schemeName}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {scheme.description}
            </p>

            {scheme.benefits && (
              <p className="text-sm text-green-700 font-medium mb-4">
                Benefits: {scheme.benefits}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleApply(scheme)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
              {scheme.applyUrl && (
                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No schemes found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
}

