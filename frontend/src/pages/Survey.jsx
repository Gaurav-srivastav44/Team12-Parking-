import React from "react";
import MultiStepForm from "../components/MultiStepForm";
import schemes from "../data/schemes.json";
import { filterSchemes } from "../utils/eligibility";

export default function Survey() {

  function done(userData) {
    const results = filterSchemes(userData, schemes);
    sessionStorage.setItem("resultSchemes", JSON.stringify(results));
    window.location.href = "/results";
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-start">
      {/* HEADER */}
      <div className="text-center mt-10 mb-8 px-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Eligibility Survey
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Answer a few questions to check which government schemes you are eligible for.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <MultiStepForm onComplete={done} />
        </div>
      </div>

      {/* FOOTNOTE */}
      <p className="text-center text-gray-500 text-sm mt-6 mb-10">
        Your information is used only for eligibility matching. It is not stored or shared.
      </p>
    </div>
  );
}
