import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // ⭐ Auto-update on language change
  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);

  const t = (en, hi) => (language === "en" ? en : hi);

  const categoryTranslate = (cat) => {
    const map = {
      Education: "शिक्षा",
      Healthcare: "स्वास्थ्य",
      Agriculture: "कृषि",
      Finance: "वित्त",
      Housing: "आवास",
      "Women & Child": "महिला और बाल",
      "Social Security": "सामाजिक सुरक्षा",
      Employment: "रोजगार",
      Environment: "पर्यावरण",
      Sports: "खेल",
      Technology: "प्रौद्योगिकी",
      Entrepreneurship: "उद्यमिता",
      "Food Security": "खाद्य सुरक्षा",
    };
    return language === "en" ? cat : map[cat] || cat;
  };

  // Fetch Schemes
  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await fetch("http://localhost:5000/api/schemes");
        const data = await res.json();

        setAllSchemes(data);
        setFilteredSchemes(data);

        const uniqueCats = [...new Set(data.map((s) => s.category))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Failed to fetch schemes:", err);
      }
    }

    fetchSchemes();
  }, []);

  // Search + Filters
  useEffect(() => {
    let result = [...allSchemes];

    if (search.trim() !== "") {
      result = result.filter((s) =>
        s.schemeName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCats.length > 0) {
      result = result.filter((s) => selectedCats.includes(s.category));
    }

    setFilteredSchemes(result);
  }, [search, selectedCats, allSchemes]);

  const handleCategoryChange = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ⭐ Sidebar With Smooth Slide Animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-xl p-5 w-64 rounded-r-2xl"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t("Filters", "फिल्टर")}
            </h2>

            <h3 className="text-gray-700 font-semibold mb-2">
              {t("Categories", "श्रेणियाँ")}
            </h3>

            <div className="space-y-2">
              {categories.slice(0, 10).map((cat, i) => (
                <motion.label
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <motion.input
                    whileTap={{ scale: 0.8 }}
                    type="checkbox"
                    checked={selectedCats.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-gray-700">
                    {categoryTranslate(cat)}
                  </span>
                </motion.label>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCats([]);
                setSearch("");
                setFilteredSchemes(allSchemes);
              }}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              {t("Reset Filters", "फिल्टर रीसेट करें")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="md:hidden p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={20} />
          </button>

          {/* Animated Search Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 ml-3 relative max-w-lg"
          >
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder={t("Search schemes...", "योजनाएँ खोजें...")}
              className="w-full bg-white p-3 pl-10 rounded-xl shadow border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t("Showing", "दिखा रहे हैं")} {filteredSchemes.length}{" "}
          {t("Schemes", "योजनाएँ")}
        </h2>

        {/* ⭐ SCHEME CARDS WITH STAGGER ANIMATION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="space-y-4"
        >
          {filteredSchemes.map((scheme) => (
            <motion.div
              key={scheme.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition border"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {scheme.schemeName}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {t("Category", "श्रेणी")}:{" "}
                <span className="font-semibold">
                  {categoryTranslate(scheme.category)}
                </span>
              </p>

              <p className="text-gray-700 mb-3">{scheme.description}</p>

              {/* ⭐ DOCUMENTS REQUIRED */}
              {scheme.documentsRequired &&
                scheme.documentsRequired.length > 0 && (
                  <div className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      {t("Documents Required:", "आवश्यक दस्तावेज़:")}
                    </p>

                    <ul className="list-disc ml-5 text-gray-700">
                      {scheme.documentsRequired.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={scheme.applyUrl}
                target="_blank"
                className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
              >
                {t("Apply Now →", "अभी आवेदन करें →")}
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
