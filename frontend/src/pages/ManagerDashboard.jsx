import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParkingLots } from '../hooks/useParkingLots';
import { mockApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import LotCard from '../components/LotCard';
import { FaSearch, FaClock, FaTimes, FaBolt, FaCogs, FaChartBar, FaMapMarkerAlt, FaCar, FaDollarSign } from 'react-icons/fa';

export default function ManagerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { parkingLots, loading, error, refetch } = useParkingLots();
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState('lots'); // 'lots' or 'reservations'
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSlots: 0,
    pricePerHour: 0,
    timeLimitMinutes: 0,
    specialOffers: '',
    active: true,
  });
  const [editingLotId, setEditingLotId] = useState(null);
  const isManager = user?.role === 'manager';
  const [liveMode, setLiveMode] = useState(false);
  const [manageSlotsLot, setManageSlotsLot] = useState(null);
  const [manageSlotsList, setManageSlotsList] = useState([]);
  const [iotEnabled, setIotEnabled] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchReservations();
    refetch(); // Refresh parking lots on mount
  }, [isAuthenticated, navigate]);

  // Refresh when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchReservations();
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await fetchReservations();
      refetch(); // Refresh parking lots to update available slots
      alert('Reservation cancelled successfully!');
    } catch (err) {
      alert('Failed to cancel reservation: ' + err.message);
    }
  };

  const openAddForm = () => {
    setEditingLotId(null);
    setFormData({ name: '', address: '', totalSlots: 0, pricePerHour: 0, timeLimitMinutes: 0, specialOffers: '', active: true });
    setShowForm(true);
  };

  const openEditForm = (lot) => {
    setEditingLotId(lot.id);
    setFormData({
      name: lot.name || '',
      address: lot.address || '',
      totalSlots: lot.totalSlots || 0,
      pricePerHour: lot.pricePerHour || 0,
      timeLimitMinutes: lot.timeLimitMinutes || 0,
      specialOffers: lot.specialOffers || '',
      active: lot.active !== false,
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLotId) {
        await mockApi.updateParkingLot(editingLotId, formData);
        alert('Parking lot updated');
      } else {
        await mockApi.createParkingLot(formData);
        alert('Parking lot created');
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
      alert('Failed to update status: ' + err.message);
    }
  };

  // Live polling
  useEffect(() => {
    let id;
    if (liveMode) {
      id = setInterval(() => {
        refetch();
      }, 5000);
    }
    return () => clearInterval(id);
  }, [liveMode]);

  const openManageSlots = async (lot) => {
    setManageSlotsLot(lot);
    try {
      const slots = await mockApi.getSlots(lot.id);
      setManageSlotsList(slots.slice(0, 50)); // show first 50 for performance
    } catch (err) {
      alert('Failed to load slots: ' + err.message);
    }
  };

  // Poll for IoT/live updates when manager opens the modal and enables IoT
  useEffect(() => {
    let id;
    if (manageSlotsLot && iotEnabled) {
      id = setInterval(async () => {
        try {
          const slots = await mockApi.getSlots(manageSlotsLot.id);
          setManageSlotsList(slots.slice(0, 50));
        } catch (err) {
          console.error('IoT polling error:', err);
        }
      }, 3000); // poll every 3s
    }
    return () => clearInterval(id);
  }, [manageSlotsLot, iotEnabled]);

  const simulateIoTUpdate = () => {
    if (!manageSlotsList.length) return;
    const updated = manageSlotsList.map((s) => {
      // randomly flip a small percentage of slots between available/occupied
      if (Math.random() < 0.12) {
        const newStatus = s.status === 'available' ? 'occupied' : 'available';
        return { ...s, status: newStatus };
      }
      return s;
    });
    setManageSlotsList(updated);
  };

  const saveSlotStatus = async (slot, newStatus) => {
    try {
      await mockApi.updateSlotStatus(manageSlotsLot.id, slot.number, newStatus);
      const updated = manageSlotsList.map(s => s.number === slot.number ? { ...s, status: newStatus } : s);
      setManageSlotsList(updated);
      refetch();
    } catch (err) {
      alert('Failed to update slot: ' + err.message);
    }
  };

  const openReport = async (lot) => {
    try {
      const r = await mockApi.generateReport(lot.id);
      setReportData(r);
      setShowReportModal(true);
    } catch (err) {
      alert('Failed to generate report: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredLots = parkingLots.filter(lot =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  const totalAvailable = parkingLots.reduce((sum, lot) => {
    const available = lot.totalSlots - (lot.totalSlots - lot.availableSlots);
    return sum + available;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your parking lots and reservations</p>
        </div>
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                Welcome back, <span className="text-blue-600">{user?.username || 'User'}</span>
              </h1>
              <p className="text-gray-600">Manage your parking lots, slots and reports</p>
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500 mr-3">Total Lots</div>
                <div className="text-xl font-bold text-gray-800">{parkingLots.length}</div>
              </div>
            </div>
          </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('lots')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lots'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parking Lots
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reservations ({reservations.length})
            </button>
          </nav>
        </div>

        {/* Non-manager info */}
        {!isManager && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">Management actions are hidden. You must be a manager to add or edit parking lots.</p>
          </div>
        )}

        {activeTab === 'lots' && (
          <>
            {isManager && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={openAddForm}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + Add Parking Lot
                </button>
              </div>
            )}
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parking lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
              {/* Search Bar */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-1/2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search parking lots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent shadow-sm"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  {isManager && (
                    <button onClick={openAddForm} className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700">
                      <FaBolt />
                      Add Parking Lot
                    </button>
                  )}
                  <div className="bg-white border px-3 py-2 rounded shadow-sm text-sm text-gray-600">Total Slots: <strong className="text-gray-800">{parkingLots.reduce((s, l) => s + l.totalSlots, 0)}</strong></div>
                </div>
              </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Lots</h3>
                <p className="text-3xl font-bold text-gray-800">{parkingLots.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Slots</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Available Slots</h3>
                <p className="text-3xl font-bold text-green-600">
                  {parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)}
                </p>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Lots</h3>
                    <div className="text-2xl font-bold text-gray-800">{parkingLots.length}</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <FaCar className="text-indigo-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Slots</h3>
                    <div className="text-2xl font-bold text-gray-800">{parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0)}</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FaDollarSign className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Available Slots</h3>
                    <div className="text-2xl font-bold text-green-600">{parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Live Mode</h3>
                  <p className="text-sm text-gray-500">{liveMode ? 'On (polling every 5s)' : 'Off'}</p>
                </div>
                <div>
                  <button onClick={() => setLiveMode(m => !m)} className={`px-3 py-2 rounded ${liveMode ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {liveMode ? 'Stop' : 'Start'}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                Error: {error}
              </div>
            )}

            {/* Parking Lots Grid */}
            {filteredLots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchTerm ? 'No parking lots found matching your search.' : 'No parking lots available.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLots.map((lot) => (
                  <div key={lot.id} className="relative">
                    <LotCard lot={lot} />
                    {isManager && (
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => openEditForm(lot)}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
                          title="Edit Lot"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleActive(lot); }}
                          className={`px-2 py-1 rounded text-sm ${lot.active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                          title="Toggle Active"
                        >
                          {lot.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${lot.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                        {lot.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 p-3 bg-white rounded-b-lg border-t">
                      <div className="flex justify-between"><div>Total Slots:</div><div><strong>{lot.totalSlots}</strong></div></div>
                      <div className="flex justify-between"><div>Available:</div><div><strong>{lot.availableSlots}</strong></div></div>
                      <div className="flex justify-between"><div>Occupied:</div><div><strong>{lot.totalSlots - lot.availableSlots}</strong></div></div>
                      <div className="mt-2 flex space-x-2">
                        {isManager && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); openManageSlots(lot); }} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm flex items-center gap-2"><FaCogs /> Manage Slots</button>
                            <button onClick={(e) => { e.stopPropagation(); openReport(lot); }} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-2"><FaChartBar /> Report</button>
                          </>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/lot/${lot.id}`); }} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add / Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{editingLotId ? 'Edit Parking Lot' : 'Add Parking Lot'}</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input name="name" placeholder="Lot name" value={formData.name} onChange={handleFormChange} className="border px-3 py-2 rounded" required />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleFormChange} className="border px-3 py-2 rounded" required />
                <div className="grid grid-cols-2 gap-2">
                  <input name="totalSlots" type="number" placeholder="Total slots" value={formData.totalSlots} onChange={handleFormChange} className="border px-3 py-2 rounded" required />
                  <input name="pricePerHour" type="number" placeholder="Price per hour" value={formData.pricePerHour} onChange={handleFormChange} className="border px-3 py-2 rounded" required />
                </div>
                <input name="timeLimitMinutes" type="number" placeholder="Time limit (minutes)" value={formData.timeLimitMinutes} onChange={handleFormChange} className="border px-3 py-2 rounded" />
                <input name="specialOffers" placeholder="Special offers" value={formData.specialOffers} onChange={handleFormChange} className="border px-3 py-2 rounded" />
                <label className="flex items-center space-x-2"><input name="active" type="checkbox" checked={formData.active} onChange={handleFormChange} /> <span>Active</span></label>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editingLotId ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Slots Modal */}
        {manageSlotsLot && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold">Manage Slots — {manageSlotsLot.name}</h2>
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input type="checkbox" checked={iotEnabled} onChange={(e) => setIotEnabled(e.target.checked)} />
                    <span>Live IoT updates</span>
                  </label>
                  <button type="button" onClick={simulateIoTUpdate} className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">Simulate IoT</button>
                </div>
                <button onClick={() => { setManageSlotsLot(null); setIotEnabled(false); }} className="text-gray-500">Close</button>
              </div>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="p-2">#</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Vehicle</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manageSlotsList.map(slot => (
                      <tr key={slot.id} className="border-t">
                        <td className="p-2">{slot.number}</td>
                        <td className="p-2">{slot.status}</td>
                        <td className="p-2">{slot.vehicleNumber || '-'}</td>
                        <td className="p-2">
                          <select defaultValue={slot.status} onChange={(e) => saveSlotStatus(slot, e.target.value)} className="border rounded px-2 py-1">
                            <option value="available">available</option>
                            <option value="occupied">occupied</option>
                            <option value="reserved">reserved</option>
                            <option value="maintenance">maintenance</option>
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Report — {reportData.lotName}</h2>
                <button onClick={() => { setShowReportModal(false); setReportData(null); }} className="text-gray-500">Close</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Total Reservations</div>
                  <div className="text-2xl font-bold">{reportData.totalReservations}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Estimated Revenue</div>
                  <div className="text-2xl font-bold">${reportData.revenue}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Peak Hour</div>
                  <div className="text-2xl font-bold">{reportData.peakHour}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Occupied / Available</div>
                  <div className="text-2xl font-bold">{reportData.occupied} / {reportData.available}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            {loadingReservations ? (
              <LoadingSpinner />
            ) : reservations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No active reservations</p>
                <p className="text-gray-500 text-sm mt-2">Reserve a parking slot to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {reservation.lotName}
                        </h3>
                        <p className="text-gray-600 mb-1">{reservation.lotAddress}</p>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Slot Number</p>
                            <p className="font-semibold text-gray-800">#{reservation.slotNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Vehicle Number</p>
                            <p className="font-semibold text-gray-800">{reservation.vehicleNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reserved Until</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(reservation.reservedUntil).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                              Reserved
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelReservation(reservation)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Cancel Reservation"
                      >
                        <FaTimes className="text-xl" />
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => navigate(`/lot/${reservation.lotId}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Parking Lot →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
