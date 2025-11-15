import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    state: "",
    category: "",
    income: "",
    education: "",
    employment: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    const cb = () => setLanguage(localStorage.getItem("language") || "en");
    window.addEventListener("language-change", cb);
    return () => window.removeEventListener("language-change", cb);
  }, []);

  const t = (en, hi) => (language === "en" ? en : hi);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.password !== form.confirmPassword) {
      return setError(t("Passwords do not match", "पासवर्ड मेल नहीं खाते"));
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          age: form.age,
          gender: form.gender,
          state: form.state,
          category: form.category,
          income: form.income,
          education: form.education,
          employment: form.employment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#dff0ff] flex justify-center items-center relative overflow-hidden">

      {/* Blurred Background Logo */}
      <img
        src={logo}
        alt="bg logo"
        className="absolute w-[80%] max-w-[650px] opacity-10 blur-[30px] -z-10"
      />

      <form
        className="relative bg-white/80 backdrop-blur-2xl shadow-xl border border-white/40 p-10 rounded-3xl w-full max-w-2xl z-10"
        onSubmit={handleSubmit}
      >
        {/* Main Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="logo" className="w-32 drop-shadow-md" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {t("Create Your Account", "अपना खाता बनाएं")}
        </h2>

        {error && <p className="text-center text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
        {success && <p className="text-center text-green-600 bg-green-100 p-2 rounded mb-4">{t("Signup successful! Redirecting...", "रजिस्ट्रेशन सफल हुआ! रीडायरेक्टिंग...")}</p>}

        {/* Grid Layout for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder={t("Full Name","पूरा नाम")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder={t("Email","ईमेल")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder={t("Phone Number","फोन नंबर")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Gender */}
          <select
            name="gender"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Select Gender","शुद्ध चयन करें")}</option>
            <option>{t("Male","पुरुष")}</option>
            <option>{t("Female","महिला")}</option>
            <option>{t("Other","अन्य")}</option>
          </select>

          {/* State */}
          <input
            type="text"
            name="state"
            placeholder="State / City"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Select Category","श्रेणी चयन करें")}</option>
            <option>{t("General","सामान्य")}</option>
            <option>{t("OBC","OBC")}</option>
            <option>{t("SC","SC")}</option>
            <option>{t("ST","ST")}</option>
          </select>

          {/* Income */}
          <input
            type="number"
            name="income"
            placeholder="Annual Income"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Education Level */}
          <input
            type="text"
            name="education"
            placeholder="Education Level"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Employment Status */}
          <select
            name="employment"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Employment Status","रोजगार स्थिति")}</option>
            <option>{t("Student","छात्र")}</option>
            <option>{t("Employed","रोजगारित")}</option>
            <option>{t("Unemployed","अर्जित नहीं")}</option>
            <option>{t("Self-Employed","स्व-रोजगार")}</option>
          </select>

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder={t("Create Username","उपयोगकर्ता नाम बनाएं")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder={t("Password","पासवर्ड")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("Confirm Password","पासवर्ड की पुष्टि करें")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 hover:bg-blue-800 transition active:scale-95"
          disabled={loading}
        >
          {loading ? t("Signing up...","साइनिंग अप में...") : t("Sign Up","रजिस्ट्रेशन")}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          {t("Already have an account?","क्या खाता है? ")}
          <a href="/login" className="text-blue-700 font-bold hover:underline">{t("Login","लॉगिन")}</a>
        </p>
      </form>
    </div>
  );
}
