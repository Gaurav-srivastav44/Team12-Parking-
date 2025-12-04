import React, { useEffect, useState } from "react";

export default function Results() {
  const [schemes, setSchemes] = useState(
    JSON.parse(sessionStorage.getItem("resultSchemes") || "[]")
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    const updateLang = () =>
      setLanguage(localStorage.getItem("language") || "en");

    window.addEventListener("language-change", updateLang);
    return () => window.removeEventListener("language-change", updateLang);
  }, []);

  const t = (en, hi) => (language === "en" ? en : hi);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-blue-900">
        {t("Eligible Schemes", "पात्र योजनाएँ")}
      </h2>

      {schemes.length === 0 ? (
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded mb-4">
          {t(
            "No matching government schemes found based on your answers.",
            "आपके उत्तरों के आधार पर कोई उपयुक्त सरकारी योजना नहीं मिली।"
          )}
        </p>
      ) : (
        <div className="space-y-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-bold text-blue-800 text-xl mb-2">
                {t(scheme.name, scheme.name)}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {t(scheme.description, scheme.description)}
              </p>

              {/* --- OPTIONAL EXTENSIONS --- */}
              {scheme.eligibility && (
                <p className="text-sm mt-3 text-gray-600">
                  <strong>{t("Eligibility:", "पात्रता:")}</strong>{" "}
                  {t(scheme.eligibility, scheme.eligibility)}
                </p>
              )}

              {scheme.link && (
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {t("Apply Now", "अभी आवेदन करें")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
