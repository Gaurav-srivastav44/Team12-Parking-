import React, { useState } from "react";

export default function MultiStepForm({ onComplete }) {
  const [u, setU] = useState({ age: 0, income: 0, state: '', categories: [] });
  const [step, setStep] = useState(1);

  function next() {
    setStep((prev) => prev + 1);
  }

  function back() {
    setStep((prev) => prev - 1);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setU({
        ...u,
        categories: checked
          ? [...u.categories, value]
          : u.categories.filter((c) => c !== value),
      });
    } else {
      setU({ ...u, [name]: value });
    }
  }

  return (
    <form
      className="max-w-lg mx-auto bg-gray-50 p-6 rounded border flex flex-col gap-6 shadow"
      onSubmit={(e) => {
        e.preventDefault();
        onComplete(u);
      }}
    >
      {step === 1 && (
        <div>
          <label className="block mb-1 font-medium text-blue-800">Age</label>
          <input
            type="number"
            name="age"
            className="w-full border p-2 rounded"
            value={u.age}
            onChange={handleChange}
            min={0}
            required
          />
          <button type="button" className="mt-4 bg-blue-900 text-white px-4 py-2 rounded float-right" onClick={next}>
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <label className="block mb-1 font-medium text-blue-800">Annual Income (₹)</label>
          <input
            type="number"
            name="income"
            className="w-full border p-2 rounded"
            value={u.income}
            onChange={handleChange}
            min={0}
            required
          />
          <div className="flex justify-between mt-4">
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={back}>
              Back
            </button>
            <button type="button" className="bg-blue-900 text-white px-4 py-2 rounded" onClick={next}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <label className="block mb-1 font-medium text-blue-800">State</label>
          <select
            name="state"
            className="w-full border p-2 rounded"
            value={u.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="MH">Maharashtra</option>
            <option value="BR">Bihar</option>
            {/* Add more as needed */}
          </select>
          <div className="flex justify-between mt-4">
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={back}>
              Back
            </button>
            <button type="button" className="bg-blue-900 text-white px-4 py-2 rounded" onClick={next}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <label className="block mb-2 font-medium text-blue-800">Categories (select all that apply)</label>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="checkbox"
                name="categories"
                value="farmer"
                checked={u.categories.includes("farmer")}
                onChange={handleChange}
              />
              <span className="ml-2">Farmer</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="categories"
                value="student"
                checked={u.categories.includes("student")}
                onChange={handleChange}
              />
              <span className="ml-2">Student</span>
            </label>
            {/* Add more if needed */}
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={back}>
              Back
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => onComplete(u)}>
              See Results
            </button>
          </div>
        </div>
      )}
    </form>
  );
}