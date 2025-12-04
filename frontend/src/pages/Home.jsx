import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaMobileAlt,
  FaRoute,
  FaBell
} from 'react-icons/fa';

// Only ONE image used everywhere
import trafficImg from '../assets/images/traffic.png';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const isAdminView = user?.role === 'admin' || user?.role === 'manager';

  const heroCta = {
    to: !isAuthenticated
      ? '/login'
      : isAdminView
      ? '/manager-dashboard'
      : '/user-dashboard',

    label: !isAuthenticated
      ? 'Get Started'
      : isAdminView
      ? 'Go to Admin Dashboard'
      : 'Go to Dashboard',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ⭐ HERO SECTION WITH SINGLE IMAGE BACKGROUND */}
      <div
        className="relative h-[450px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${trafficImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">Parking Manager</h1>
          <p className="text-xl mb-8 text-blue-100 drop-shadow-md">
            Smart parking solutions for modern cities
          </p>

          <Link
            to={heroCta.to}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            {heroCta.label}
          </Link>
        </div>
      </div>

      {/* ⭐ FEATURES SECTION */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Find Parking</h3>
            <p className="text-gray-600">Locate nearby available parking spots.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaClock className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reserve Slots</h3>
            <p className="text-gray-600">Book your parking in advance.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaCheckCircle className="text-4xl text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Live slot availability & updates.</p>
          </div>

          {/* Extra Features */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaMobileAlt className="text-4xl text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">Easy to use on any device.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaRoute className="text-4xl text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Navigation Support</h3>
            <p className="text-gray-600">Get directions to parking lots.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
            <FaBell className="text-4xl text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Alerts</h3>
            <p className="text-gray-600">Receive real-time notifications.</p>
          </div>

        </div>
      </div>

      {/* ⭐ TRAFFIC IMAGE SECTION */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Reduce Traffic & Save Time
            </h2>
            <p className="text-gray-600 mb-6">
              Smart parking reduces congestion, avoids unnecessary driving,
              and helps users reach their destination faster.
            </p>

            <Link
              to={heroCta.to}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Parking →
            </Link>
          </div>

          <div className="flex justify-center">
            <img
              src={trafficImg}
              alt="Traffic"
              className="w-full max-w-md rounded-lg drop-shadow-xl"
            />
          </div>

        </div>
      </div>

    </div>
  );
}
