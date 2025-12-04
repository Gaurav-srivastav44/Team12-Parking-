import React, { useState } from 'react';
import { FaUsers, FaParking, FaClipboardList, FaCogs } from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of system metrics and administration actions</p>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <FaParking className="text-green-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Lots</div>
              <div className="text-2xl font-bold text-gray-900">42</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FaClipboardList className="text-yellow-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Reservations</div>
              <div className="text-2xl font-bold text-gray-900">128</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <FaCogs className="text-indigo-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">System Health</div>
              <div className="text-2xl font-bold text-green-600">Good</div>
            </div>
          </div>
        </div>

        <div className="tab-content-wrapper bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Overview</h3>
              <p className="text-gray-600">Quick summary and recent activity.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Users</h3>
              <p className="text-gray-600">Manage users from this panel (coming soon).</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Settings</h3>
              <p className="text-gray-600">Platform-wide settings and preferences.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
