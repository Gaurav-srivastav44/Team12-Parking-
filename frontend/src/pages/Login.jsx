import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaArrowRight, FaMagic } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const performLogin = async (user, pass) => {
    setError('');
    setLoading(true);

    try {
      // Mock login - replace with actual API call when backend is ready
      if (user && pass) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        // assign role based on username for demo accounts
        let role = 'user';
        const uname = String(user).toLowerCase();
        if (uname === 'manager' || uname.includes('manager')) role = 'manager';
        else if (uname === 'admin' || uname.includes('admin')) role = 'admin';

        const userData = {
          username: user,
          id: Date.now(),
          role,
        };

        login(userData, mockToken);
        // Redirect based on role
        if (role === 'manager') navigate('/manager-dashboard');
        else if (role === 'admin') navigate('/admin-dashboard');
        else navigate('/');
      } else {
        setError('Please enter username and password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin(username, password);
  };

  const handleDemoLogin = async (demoUser) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    await performLogin(demoUser.username, demoUser.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Parking Manager</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <FaArrowRight />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
          </div>
        </div>

        {/* Demo Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleDemoLogin({ username: 'demo_user', password: 'demo123' })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <FaMagic className="mr-1" />
            Demo User
          </button>
          
          <button
            onClick={() => handleDemoLogin({ username: 'admin', password: 'admin123' })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <FaUser className="mr-1" />
            Admin Demo
          </button>

          <button
            onClick={() => handleDemoLogin({ username: 'manager', password: 'manager123' })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <FaUser className="mr-1" />
            Manager Demo
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-xs">
          Or enter any username and password to continue
        </p>
      </div>
    </div>
  );
}

