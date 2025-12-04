import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdminView = user?.role === 'admin' || user?.role === 'manager';
  const dashboardPath = isAdminView ? '/manager-dashboard' : '/user-dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold hover:text-blue-200 transition">
            Parking Manager
          </Link>
          
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="hover:text-blue-200 transition">
                  {isAdminView ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <span className="text-blue-200">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-blue-200 transition">Home</Link>
                <Link
                  to="/login"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

