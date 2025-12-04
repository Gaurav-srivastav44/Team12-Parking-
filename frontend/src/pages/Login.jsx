import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FaUser, FaLock, FaArrowRight, FaMagic } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const inferRole = (name, override) => {
    if (override) return override;
    const normalized = name?.trim().toLowerCase();
    if (normalized === 'admin') return 'admin';
    if (normalized === 'manager') return 'manager';
    return 'user';
  };

  const getRedirectPath = (role) =>
    role === 'admin' || role === 'manager' ? '/manager-dashboard' : '/user-dashboard';

  const performMockLogin = (user, roleOverride) => {
    const role = inferRole(user, roleOverride);
    const mockToken = 'mock-jwt-token-' + Date.now();
    const userData = {
      username: user,
      id: Date.now(),
      role,
    };
    login(userData, mockToken);
    navigate(getRedirectPath(role), { replace: true });
  };

  const performLogin = async (user, pass, options = {}) => {
    const { roleOverride, skipApi } = options;
    setError('');
    setLoading(true);

    try {
      if (!user || !pass) {
        setError('Please enter username and password');
        return;
      }

      if (skipApi) {
        performMockLogin(user, roleOverride);
        return;
      }

      const { token } = await api.login(user, pass);
      let userData = {
        username: user,
        id: Date.now(),
        role: inferRole(user, roleOverride),
      };

      try {
        const profile = await api.getProfile(token);
        userData = {
          username: profile.username || profile.email || user,
          id: profile._id || profile.id || Date.now(),
          role: profile.role || inferRole(user, roleOverride),
          fullName: profile.fullName,
          email: profile.email,
        };
      } catch (profileErr) {
        console.warn('Profile fetch failed:', profileErr);
      }

      login(userData, token);
      navigate(getRedirectPath(userData.role), { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin(username, password);
  };

  const handleDemoLogin = async (demoUser, roleOverride) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    await performLogin(demoUser.username, demoUser.password, {
      roleOverride,
      skipApi: true,
    });
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              handleDemoLogin({ username: 'demo_user', password: 'demo123' }, 'user')
            }
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            <FaMagic />
            Demo User
          </button>

          <button
            onClick={() =>
              handleDemoLogin({ username: 'admin', password: 'admin123' }, 'admin')
            }
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            <FaUser />
            Admin Demo
          </button>

          <button
            onClick={() =>
              handleDemoLogin({ username: 'manager', password: 'manager123' }, 'manager')
            }
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            <FaUser />
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
