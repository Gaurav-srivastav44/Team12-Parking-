import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParkingLots } from '../hooks/useParkingLots';
import { mockApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import LotCard from '../components/LotCard';
import { FaSearch, FaClock, FaTimes } from 'react-icons/fa';

export default function ManagerDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { parkingLots, loading, error, refetch } = useParkingLots();
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState('lots'); // 'lots' or 'reservations'

  const canAccessDashboard = user?.role === 'manager' || user?.role === 'admin';

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!canAccessDashboard) {
      navigate('/', { replace: true });
      return;
    }
    fetchReservations();
    refetch(); // Refresh parking lots on mount
  }, [authLoading, isAuthenticated, canAccessDashboard, navigate]);

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

  if (!isAuthenticated || !canAccessDashboard) {
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

        {activeTab === 'lots' && (
          <>
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
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            )}
          </>
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
