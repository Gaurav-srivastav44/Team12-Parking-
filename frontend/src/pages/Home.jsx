import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Parking Manager</h1>
          <p className="text-xl mb-8 text-blue-100">
            Smart parking solutions for modern cities
          </p>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Get Started
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/manager-dashboard"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Find Parking</h3>
            <p className="text-gray-600">
              Easily locate available parking spots near you
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaClock className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reserve Slots</h3>
            <p className="text-gray-600">
              Reserve your parking slot in advance
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaCheckCircle className="text-4xl text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Get live updates on parking availability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
