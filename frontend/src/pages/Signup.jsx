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
          {t("Create Your Parking Account", "अपना पार्किंग खाता बनाएं")}
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

          {/* Age → Repurposed as Driver's License Years */}
          <input
            type="number"
            name="age"
            placeholder={t("Years of Driving Experience","ड्राइविंग अनुभव (वर्ष)")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Gender → Repurposed as Vehicle Type */}
          <select
            name="gender"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Select Vehicle Type","वाहन प्रकार चुनें")}</option>
            <option>{t("Car","कार")}</option>
            <option>{t("Motorcycle","मोटरसाइकिल")}</option>
            <option>{t("SUV","SUV")}</option>
            <option>{t("Truck","ट्रक")}</option>
            <option>{t("Van","वैन")}</option>
          </select>

          {/* State → Repurposed as City/Location */}
          <input
            type="text"
            name="state"
            placeholder={t("City / Location","शहर / स्थान")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Category → Repurposed as Vehicle Category */}
          <select
            name="category"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Select Vehicle Category","वाहन श्रेणी चुनें")}</option>
            <option>{t("Sedan","सेडान")}</option>
            <option>{t("Hatchback","हैचबैक")}</option>
            <option>{t("SUV","SUV")}</option>
            <option>{t("Compact","कॉम्पैक्ट")}</option>
            <option>{t("Large Vehicle","बड़ा वाहन")}</option>
          </select>

          {/* Income → Repurposed as Monthly Parking Budget */}
          <input
            type="number"
            name="income"
            placeholder={t("Monthly Parking Budget (₹)","मासिक पार्किंग बजट (₹)")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Education → Repurposed as Vehicle License Plate */}
          <input
            type="text"
            name="education"
            placeholder={t("Vehicle License Plate","वाहन लाइसेंस प्लेट")}
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          />

          {/* Employment → Repurposed as Payment Method */}
          <select
            name="employment"
            className="p-3 border rounded-xl outline-none"
            onChange={handleChange}
            required
          >
            <option value="">{t("Preferred Payment Method","पसंदीदा भुगतान विधि")}</option>
            <option>{t("Credit Card","क्रेडिट कार्ड")}</option>
            <option>{t("Debit Card","डेबिट कार्ड")}</option>
            <option>{t("UPI","UPI")}</option>
            <option>{t("Cash","नकद")}</option>
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
