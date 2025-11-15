import React, { useEffect, useState } from "react";

export default function Results() {
  const d = JSON.parse(sessionStorage.getItem("resultSchemes") || "[]");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);
  const t = (en, hi) => (language === "en" ? en : hi);
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-blue-900">{t("Eligible Schemes", "पात्र योजनाएँ")}</h2>
      {d.length === 0 ? (
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded mb-4">{t("No matching government schemes found based on your answers.", "आपके उत्तरों के आधार पर कोई उपयुक्त सरकारी योजना नहीं मिली।")}</p>
      ) : (
        <div className="space-y-6">
          {d.map((s) => (
            <div key={s.id} className="border rounded p-4 bg-gray-50 shadow">
              <h3 className="font-bold text-blue-900 text-lg mb-2">{t(s.name, s.name)}</h3>
              <p className="text-gray-800 mb-2">{t(s.description, s.description)}</p>
              {/* Optionally, add more info (eligibility, apply link) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}