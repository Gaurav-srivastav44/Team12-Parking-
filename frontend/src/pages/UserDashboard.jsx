import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParkingLots } from '../hooks/useParkingLots';
import { mockApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import LotCard from '../components/LotCard';
import { FaSearch, FaClock, FaMapMarkerAlt, FaCar } from 'react-icons/fa';

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { parkingLots, loading, error, refetch } = useParkingLots();
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => console.log("Location permission denied")
    );
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.role === 'manager' || user?.role === 'admin') {
      navigate('/manager-dashboard', { replace: true });
      return;
    }
    fetchReservations();
  }, [authLoading, isAuthenticated, user, navigate]);

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
    if (!window.confirm(`Cancel reservation for slot ${reservation.slotNumber}?`)) return;

    try {
      await mockApi.releaseSlot(reservation.lotId, reservation.slotId);
      await fetchReservations();
      refetch();
      alert('Reservation cancelled successfully!');
    } catch (err) {
      alert('Failed to cancel reservation: ' + err.message);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const getRemainingTime = (target) => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  const filteredLots = parkingLots.filter(lot =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Find and reserve your parking space</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Lots</p>
                <p className="text-3xl font-bold">{parkingLots.length}</p>
              </div>
              <FaMapMarkerAlt className="text-4xl text-blue-500 opacity-30" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Slots</p>
                <p className="text-3xl font-bold">
                  {parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0)}
                </p>
              </div>
              <FaCar className="text-4xl text-green-500 opacity-30" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Reservations</p>
                <p className="text-3xl font-bold text-purple-600">
                  {reservations.length}
                </p>
              </div>
              <FaClock className="text-4xl text-purple-500 opacity-30" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-1 inline-flex">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'explore'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Explore Parking Lots
          </button>

          <button
            onClick={() => setActiveTab('my-reservations')}
            className={`px-6 py-3 rounded-lg font-semibold relative ${
              activeTab === 'my-reservations'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Reservations
            {reservations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {reservations.length}
              </span>
            )}
          </button>
        </div>

        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <div>
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Clear
                </button>
                <button
                  onClick={() => setSearchTerm("mall")}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Near Malls
                </button>
                <button
                  onClick={() => setSearchTerm("hospital")}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Near Hospitals
                </button>
              </div>
            </div>

            {filteredLots.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto" />
                <p className="text-gray-600 mt-4">No parking lots found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLots.map((lot) => {
                  const distance = userLocation
                    ? calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        lot.lat,
                        lot.lng
                      )
                    : null;

                  const available = lot.availableSlots > 0;
                  const recommended = lot.availableSlots / lot.totalSlots > 0.5;

                  return (
                    <div key={lot.id} className="relative">

                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                          available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {available ? "Available" : "Full"}
                      </span>

                      {recommended && (
                        <span className="absolute -top-2 left-3 bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                          Recommended ⭐
                        </span>
                      )}

                      {distance && (
                        <span className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full text-sm shadow">
                          {distance} km
                        </span>
                      )}

                      <LotCard lot={lot} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'my-reservations' && (
          <div>
            {loadingReservations ? (
              <LoadingSpinner />
            ) : reservations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">No Active Reservations</h3>
                <p className="text-gray-600 mt-2">
                  Start by exploring parking lots and reserving a slot!
                </p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Explore Parking Lots
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaCar className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{reservation.lotName}</h3>
                            <p className="text-gray-600 text-sm">{reservation.lotAddress}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Slot Number</p>
                            <p className="font-bold text-lg">#{reservation.slotNumber}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Vehicle</p>
                            <p className="font-bold">{reservation.vehicleNumber}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Remaining Time</p>
                            <p className="font-bold text-blue-600 animate-pulse">
                              {getRemainingTime(reservation.reservedUntil)}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Status</p>
                            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/lot/${reservation.lotId}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View Lot
                        </button>

                        <button
                          onClick={() => handleCancelReservation(reservation)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </div>
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
