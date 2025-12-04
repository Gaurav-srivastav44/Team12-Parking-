import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParkingLot, useSlots } from '../hooks/useParkingLots';
import { mockApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SlotCard from '../components/SlotCard';
import { FaArrowLeft, FaMapMarkerAlt, FaCar, FaDollarSign } from 'react-icons/fa';

export default function LotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { parkingLot, loading: lotLoading, refetch: refetchLot } = useParkingLot(id);
  const { slots, loading: slotsLoading, refetch: refetchSlots } = useSlots(id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserving, setReserving] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowReserveModal(true);
  };

  const handleReserve = async () => {
    if (!vehicleNumber.trim()) {
      alert('Please enter a vehicle number');
      return;
    }

    try {
      setReserving(true);
      await mockApi.reserveSlot(id, selectedSlot.id, vehicleNumber.trim());
      setShowReserveModal(false);
      setSelectedSlot(null);
      setVehicleNumber('');
      await refetchSlots(); // Wait for slots to refresh
      await refetchLot(); // Update lot statistics
      alert(`Slot ${selectedSlot.number} reserved successfully!`);
    } catch (error) {
      alert('Failed to reserve slot: ' + error.message);
    } finally {
      setReserving(false);
    }
  };

  const handleReleaseSlot = async (slot) => {
    if (!window.confirm(`Release slot ${slot.number}? This will free up the parking space.`)) {
      return;
    }

    try {
      await mockApi.releaseSlot(id, slot.id);
      await refetchSlots();
      await refetchLot(); // Update lot statistics
      alert('Slot released successfully!');
    } catch (error) {
      alert('Failed to release slot: ' + error.message);
    }
  };

  if (lotLoading || slotsLoading) return <LoadingSpinner />;
  if (!parkingLot) return <div className="p-4 text-red-600">Parking lot not found</div>;

  const availableSlots = slots.filter(s => s.status === 'available');
  const occupiedSlots = slots.filter(s => s.status === 'occupied');
  const reservedSlots = slots.filter(s => s.status === 'reserved');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/manager-dashboard')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>

        {/* Lot Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{parkingLot.name}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <FaMapMarkerAlt className="mr-2" />
            <span>{parkingLot.address}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <FaCar className="mr-3 text-blue-500 text-2xl" />
              <div>
                <p className="text-sm text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-800">{parkingLot.totalSlots}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCar className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableSlots.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaDollarSign className="mr-3 text-green-500 text-2xl" />
              <div>
                <p className="text-sm text-gray-600">Price per Hour</p>
                <p className="text-2xl font-bold text-gray-800">${parkingLot.pricePerHour}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Available</p>
            <p className="text-2xl font-bold text-green-700">{availableSlots.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">Occupied</p>
            <p className="text-2xl font-bold text-red-700">{occupiedSlots.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700 font-medium">Reserved</p>
            <p className="text-2xl font-bold text-yellow-700">{reservedSlots.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 font-medium">Maintenance</p>
            <p className="text-2xl font-bold text-gray-700">
              {slots.filter(s => s.status === 'maintenance').length}
            </p>
          </div>
        </div>

        {/* Slots Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Parking Slots</h2>
            <button
              onClick={refetchSlots}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {slots.map((slot) => (
              <div key={slot.id} className="relative">
                <SlotCard
                  slot={slot}
                  onSelect={handleSlotSelect}
                  selected={selectedSlot?.id === slot.id}
                />
                {(slot.status === 'reserved' || slot.status === 'occupied') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReleaseSlot(slot);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                    title="Release Slot"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reserve Modal */}
        {showReserveModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reserve Slot {selectedSlot.number}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="Enter vehicle number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> ${parkingLot.pricePerHour} per hour
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duration:</strong> 1 hour (default)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReserveModal(false);
                    setSelectedSlot(null);
                    setVehicleNumber('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={reserving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  disabled={reserving || !vehicleNumber.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reserving ? 'Reserving...' : 'Reserve Slot'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

