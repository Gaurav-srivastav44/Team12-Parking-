import React, { useEffect, useState } from "react";
export default function Scholarships() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);
  const t = (en, hi) => (language === "en" ? en : hi);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#09345c] mb-6">{t("Scholarships", "छात्रवृत्तियाँ")}</h2>
      <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
        <p className="text-gray-700 text-lg">{t("List of scholarship programs will appear here.", "छात्रवृत्ति कार्यक्रमों की सूची यहाँ दिखाई देगी।")}</p>
      </div>
    </div>
  );
}
