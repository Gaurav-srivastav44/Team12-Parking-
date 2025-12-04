import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!form.username.trim() || !form.password.trim()) {
      return setError(t("Please fill in username and password", "कृपया उपयोगकर्ता नाम और पासवर्ड भरें"));
    }

    if (form.password !== form.confirmPassword) {
      return setError(t("Passwords do not match", "पासवर्ड मेल नहीं खाते"));
    }

    if (form.password.length < 6) {
      return setError(t("Password must be at least 6 characters", "पासवर्ड कम से कम 6 अक्षर होना चाहिए"));
    }

    setLoading(true);
    try {
      // Step 1: Signup - Create account
      const signupRes = await fetch("http://localhost:5000/api/signup", {
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

      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        throw new Error(signupData.error || t("Signup failed", "रजिस्ट्रेशन विफल"));
      }

      // Step 2: Auto-login after successful signup
      const loginRes = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: form.username, 
          password: form.password 
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.error || t("Auto-login failed", "स्वचालित लॉगिन विफल"));
      }

      // Step 3: Get user profile (same as Login page)
      const profileRes = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      
      if (!profileRes.ok) {
        throw new Error(t("Failed to fetch user profile", "उपयोगकर्ता प्रोफ़ाइल प्राप्त करने में विफल"));
      }
      
      const userData = await profileRes.json();
      
      // Step 4: Determine role (same logic as Login page)
      let role = 'user';
      if (userData.username === 'admin' || userData.username?.includes('admin')) {
        role = 'admin';
      } else if (userData.username === 'manager' || userData.username?.includes('manager')) {
        role = 'manager';
      }
      
      const userWithRole = {
        ...userData,
        role: role,
      };
      
      // Step 5: Store in AuthContext (same as Login page)
      login(userWithRole, loginData.token);
      
      // Step 6: Navigate to dashboard (same as Login page)
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError(err.message || t("Signup failed", "रजिस्ट्रेशन विफल"));
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {t("Signup successful! Redirecting to dashboard...", "रजिस्ट्रेशन सफल हुआ! डैशबोर्ड पर रीडायरेक्टिंग...")}
          </div>
        )}

        {/* Grid Layout for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder={t("Full Name","पूरा नाम")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.fullName}
            disabled={loading}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder={t("Email","ईमेल")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.email}
            disabled={loading}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder={t("Phone Number","फोन नंबर")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.phone}
            disabled={loading}
            required
          />

          {/* Age → Repurposed as Driver's License Years */}
          <input
            type="number"
            name="age"
            placeholder={t("Years of Driving Experience","ड्राइविंग अनुभव (वर्ष)")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.age}
            disabled={loading}
            required
          />

          {/* Gender → Repurposed as Vehicle Type */}
          <select
            name="gender"
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            onChange={handleChange}
            value={form.gender}
            disabled={loading}
            required
          >
            <option value="">{t("Select Vehicle Type","वाहन प्रकार चुनें")}</option>
            <option value="Car">{t("Car","कार")}</option>
            <option value="Motorcycle">{t("Motorcycle","मोटरसाइकिल")}</option>
            <option value="SUV">{t("SUV","SUV")}</option>
            <option value="Truck">{t("Truck","ट्रक")}</option>
            <option value="Van">{t("Van","वैन")}</option>
          </select>

          {/* State → Repurposed as City/Location */}
          <input
            type="text"
            name="state"
            placeholder={t("City / Location","शहर / स्थान")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.state}
            disabled={loading}
            required
          />

          {/* Category → Repurposed as Vehicle Category */}
          <select
            name="category"
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            onChange={handleChange}
            value={form.category}
            disabled={loading}
            required
          >
            <option value="">{t("Select Vehicle Category","वाहन श्रेणी चुनें")}</option>
            <option value="Sedan">{t("Sedan","सेडान")}</option>
            <option value="Hatchback">{t("Hatchback","हैचबैक")}</option>
            <option value="SUV">{t("SUV","SUV")}</option>
            <option value="Compact">{t("Compact","कॉम्पैक्ट")}</option>
            <option value="Large Vehicle">{t("Large Vehicle","बड़ा वाहन")}</option>
          </select>

          {/* Income → Repurposed as Monthly Parking Budget */}
          <input
            type="number"
            name="income"
            placeholder={t("Monthly Parking Budget (₹)","मासिक पार्किंग बजट (₹)")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.income}
            disabled={loading}
            required
          />

          {/* Education → Repurposed as Vehicle License Plate */}
          <input
            type="text"
            name="education"
            placeholder={t("Vehicle License Plate","वाहन लाइसेंस प्लेट")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            onChange={handleChange}
            value={form.education}
            disabled={loading}
            required
          />

          {/* Employment → Repurposed as Payment Method */}
          <select
            name="employment"
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            onChange={handleChange}
            value={form.employment}
            disabled={loading}
            required
          >
            <option value="">{t("Preferred Payment Method","पसंदीदा भुगतान विधि")}</option>
            <option value="Credit Card">{t("Credit Card","क्रेडिट कार्ड")}</option>
            <option value="Debit Card">{t("Debit Card","डेबिट कार्ड")}</option>
            <option value="UPI">{t("UPI","UPI")}</option>
            <option value="Cash">{t("Cash","नकद")}</option>
          </select>

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder={t("Create Username","उपयोगकर्ता नाम बनाएं")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.username}
            disabled={loading}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder={t("Password","पासवर्ड")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.password}
            disabled={loading}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("Confirm Password","पासवर्ड की पुष्टि करें")}
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={form.confirmPassword}
            disabled={loading}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 hover:bg-blue-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
