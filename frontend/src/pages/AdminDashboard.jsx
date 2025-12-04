import React from 'react';
import { FaUsers, FaParking, FaClipboardList, FaCogs } from 'react-icons/fa';

export default function AdminDashboard() {
  // Lightweight admin overview UI — can be extended later
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of system metrics and administration actions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold text-gray-900">{/* dynamic value */} {42}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FaClipboardList className="text-yellow-600 text-xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Reservations</div>
              <div className="text-2xl font-bold text-gray-900">{/* dynamic value */} 128</div>
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Recent Admin Actions</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Updated pricing for Lot A</li>
              <li>Deactivated user demo_user</li>
              <li>Generated monthly revenue report</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="text-left px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded">Manage Users</button>
              <button className="text-left px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded">Manage Lots</button>
              <button className="text-left px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded">View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

