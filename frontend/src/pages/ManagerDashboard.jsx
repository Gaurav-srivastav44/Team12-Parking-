import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParkingLots } from '../hooks/useParkingLots';
import { mockApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import LotCard from '../components/LotCard';

import {
  FaSearch,
  FaClock,
  FaTimes,
  FaBolt,
  FaCogs,
  FaChartBar,
  FaMapMarkerAlt,
  FaCar,
  FaDollarSign,
} from 'react-icons/fa';

export default function ManagerDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { parkingLots, loading, error, refetch } = useParkingLots();

  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  const [activeTab, setActiveTab] = useState('lots');

  const [showForm, setShowForm] = useState(false);
  const [editingLotId, setEditingLotId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSlots: 0,
    pricePerHour: 0,
    timeLimitMinutes: 0,
    specialOffers: '',
    active: true,
  });

  const [liveMode, setLiveMode] = useState(false);
  const [manageSlotsLot, setManageSlotsLot] = useState(null);
  const [manageSlotsList, setManageSlotsList] = useState([]);
  const [iotEnabled, setIotEnabled] = useState(false);

  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const canAccessDashboard = user?.role === 'manager' || user?.role === 'admin';
  const isManager = user?.role === 'manager';

  // Redirect if unauthorized
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!canAccessDashboard) {
      navigate('/', { replace: true });
      return;
    }

    fetchReservations();
    refetch();
  }, [authLoading, isAuthenticated, canAccessDashboard]);

  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchReservations();
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      const data = await mockApi.getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleCancelReservation = async (reservation) => {
    if (!window.confirm(`Cancel reservation for slot ${reservation.slotNumber} at ${reservation.lotName}?`)) {
      return;
    }
    try {
      await mockApi.releaseSlot(reservation.lotId, reservation.slotId);
      fetchReservations();
      refetch();
      alert('Reservation cancelled!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // ---- Lot Form Logic ----
  const openAddForm = () => {
    setEditingLotId(null);
    setFormData({
      name: '',
      address: '',
      totalSlots: 0,
      pricePerHour: 0,
      timeLimitMinutes: 0,
      specialOffers: '',
      active: true,
    });
    setShowForm(true);
  };

  const openEditForm = (lot) => {
    setEditingLotId(lot.id);
    setFormData({
      name: lot.name,
      address: lot.address,
      totalSlots: lot.totalSlots,
      pricePerHour: lot.pricePerHour,
      timeLimitMinutes: lot.timeLimitMinutes,
      specialOffers: lot.specialOffers,
      active: lot.active !== false,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        totalSlots: Number(formData.totalSlots),
        pricePerHour: Number(formData.pricePerHour),
        timeLimitMinutes: Number(formData.timeLimitMinutes),
      };

      if (editingLotId) {
        await mockApi.updateParkingLot(editingLotId, payload);
        alert('Parking lot updated!');
      } else {
        await mockApi.createParkingLot(payload);
        alert('Parking lot created!');
      }
      setShowForm(false);
      refetch();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const toggleActive = async (lot) => {
    try {
      await mockApi.updateParkingLot(lot.id, { active: !lot.active });
      refetch();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // ---- Live Polling ----
  useEffect(() => {
    let id;
    if (liveMode) {
      id = setInterval(refetch, 5000);
    }
    return () => clearInterval(id);
  }, [liveMode]);

  // ---- Manage Slots ----
  const openManageSlots = async (lot) => {
    setManageSlotsLot(lot);
    try {
      const slots = await mockApi.getSlots(lot.id);
      setManageSlotsList(slots.slice(0, 50));
    } catch (err) {
      alert('Failed to load slots');
    }
  };

  useEffect(() => {
    let id;
    if (manageSlotsLot && iotEnabled) {
      id = setInterval(async () => {
        try {
          const slots = await mockApi.getSlots(manageSlotsLot.id);
          setManageSlotsList(slots.slice(0, 50));
        } catch {}
      }, 3000);
    }
    return () => clearInterval(id);
  }, [manageSlotsLot, iotEnabled]);

  const saveSlotStatus = async (slot, newStatus) => {
    try {
      await mockApi.updateSlotStatus(manageSlotsLot.id, slot.number, newStatus);
      setManageSlotsList((prev) =>
        prev.map((s) => (s.number === slot.number ? { ...s, status: newStatus } : s))
      );
      refetch();
    } catch {
      alert('Failed to update slot');
    }
  };

  // ---- Report ----
  const openReport = async (lot) => {
    try {
      const r = await mockApi.generateReport(lot.id);
      setReportData(r);
      setShowReportModal(true);
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  if (!isAuthenticated || !canAccessDashboard) return null;

  if (loading) return <LoadingSpinner />;

  const filteredLots = parkingLots.filter((lot) =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Hello, <span className="text-blue-600">{user?.username}</span>
          </h1>
          <div className="bg-white border px-4 py-2 rounded shadow">
            Total Lots: <strong>{parkingLots.length}</strong>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <button
            onClick={() => setActiveTab('lots')}
            className={`pb-3 px-4 ${activeTab === 'lots'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'}`}
          >
            Parking Lots
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 px-4 ${activeTab === 'reservations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'}`}
          >
            Reservations ({reservations.length})
          </button>
        </div>

        {/* Parking Lots */}
        {activeTab === 'lots' && (
          <>
            {/* Search & Add */}
            <div className="flex justify-between mb-6">
              <div className="relative w-1/2">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  className="pl-10 pr-3 py-2 border rounded w-full"
                  placeholder="Search lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isManager && (
                <button
                  onClick={openAddForm}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  + Add Lot
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLots.map((lot) => (
                <div key={lot.id} className="relative">
                  <LotCard lot={lot} />

                  {isManager && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => openEditForm(lot)}
                        className="bg-yellow-200 text-yellow-800 px-2 py-1 text-sm rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(lot)}
                        className={`px-2 py-1 text-sm rounded ${lot.active ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}
                      >
                        {lot.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs rounded ${lot.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {lot.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-2 p-3 bg-white rounded border text-sm">
                    <div className="flex justify-between">
                      <span>Total Slots:</span>
                      <strong>{lot.totalSlots}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <strong>{lot.availableSlots}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupied:</span>
                      <strong>{lot.totalSlots - lot.availableSlots}</strong>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {isManager && (
                        <>
                          <button
                            onClick={() => openManageSlots(lot)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded flex items-center gap-2"
                          >
                            <FaCogs /> Slots
                          </button>

                          <button
                            onClick={() => openReport(lot)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded flex items-center gap-2"
                          >
                            <FaChartBar /> Report
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => navigate(`/lot/${lot.id}`)}
                        className="px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reservations */}
        {activeTab === 'reservations' && (
          <div>
            {loadingReservations ? (
              <LoadingSpinner />
            ) : reservations.length === 0 ? (
              <div className="text-center bg-white p-12 rounded shadow">
                <FaClock className="text-6xl text-gray-300 mx-auto mb-3" />
                <p>No active reservations</p>
              </div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white p-6 rounded shadow mb-4">
                  <h3 className="text-xl font-bold">{reservation.lotName}</h3>
                  <p className="text-gray-600 mb-2">{reservation.lotAddress}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Slot</p>
                      <p className="font-bold">#{reservation.slotNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle</p>
                      <p className="font-bold">{reservation.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Until</p>
                      <p className="font-bold">{new Date(reservation.reservedUntil).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Reserved</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <button
                      onClick={() => navigate(`/lot/${reservation.lotId}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Lot →
                    </button>
                    <button
                      onClick={() => handleCancelReservation(reservation)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingLotId ? 'Edit Parking Lot' : 'Add New Parking Lot'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Lot Name"
                  className="border p-2 rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Address"
                  className="border p-2 rounded"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Total Slots"
                  className="border p-2 rounded"
                  value={formData.totalSlots}
                  onChange={(e) =>
                    setFormData({ ...formData, totalSlots: Number(e.target.value) })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price / Hour"
                  className="border p-2 rounded"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerHour: Number(e.target.value) })
                  }
                  required
                />

                {/* Special offers */}
                <textarea
                  placeholder="Special offers..."
                  className="border p-2 rounded col-span-2"
                  value={formData.specialOffers}
                  onChange={(e) =>
                    setFormData({ ...formData, specialOffers: e.target.value })
                  }
                />

                <label className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>

              <div className="text-right mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-2 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editingLotId ? 'Save Changes' : 'Add Lot'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slot Management Modal */}
        {manageSlotsLot && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Manage Slots — {manageSlotsLot.name}
                </h2>

                <button
                  onClick={() => {
                    setManageSlotsLot(null);
                    setIotEnabled(false);
                  }}
                  className="text-gray-500"
                >
                  Close
                </button>
              </div>

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={iotEnabled}
                  onChange={(e) => setIotEnabled(e.target.checked)}
                />
                Enable Live IoT Updates
              </label>

              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="p-2">#</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Vehicle</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manageSlotsList.map((slot) => (
                      <tr key={slot.id} className="border-t">
                        <td className="p-2">{slot.number}</td>
                        <td className="p-2">{slot.status}</td>
                        <td className="p-2">{slot.vehicleNumber || '-'}</td>
                        <td className="p-2">
                          <select
                            defaultValue={slot.status}
                            onChange={(e) => saveSlotStatus(slot, e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">Report — {reportData.lotName}</h2>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportData(null);
                  }}
                  className="text-gray-500"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Total Reservations</p>
                  <p className="text-2xl font-bold">{reportData.totalReservations}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">${reportData.revenue}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Peak Hour</p>
                  <p className="text-2xl font-bold">{reportData.peakHour}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Occupied / Available</p>
                  <p className="text-2xl font-bold">
                    {reportData.occupied} / {reportData.available}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
