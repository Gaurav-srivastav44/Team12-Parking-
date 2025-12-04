import React from 'react';

export default function SlotCard({ slot, onSelect, selected, disabled }) {
  const getStatusColor = () => {
    if (slot.status === 'occupied') return 'bg-red-500';
    if (slot.status === 'reserved') return 'bg-yellow-500';
    if (slot.status === 'maintenance') return 'bg-gray-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (slot.status === 'occupied') return 'Occupied';
    if (slot.status === 'reserved') return 'Reserved';
    if (slot.status === 'maintenance') return 'Maintenance';
    return 'Available';
  };

  const isAvailable = slot.status === 'available' && !disabled;

  return (
    <div
      onClick={() => isAvailable && onSelect && onSelect(slot)}
      className={`
        p-4 rounded-lg border-2 transition-all
        ${selected ? 'border-blue-500 shadow-lg ring-2 ring-blue-300' : 'border-gray-300'}
        ${isAvailable ? 'cursor-pointer hover:shadow-md hover:border-blue-400' : 'cursor-not-allowed opacity-75'}
        ${slot.status === 'available' ? 'bg-green-50' : 'bg-gray-50'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-gray-800">Slot {slot.number}</h3>
        <div className={`w-4 h-4 rounded-full ${getStatusColor()}`} title={getStatusText()} />
      </div>
      
      <p className={`text-sm font-medium ${
        slot.status === 'available' ? 'text-green-700' : 
        slot.status === 'occupied' ? 'text-red-700' :
        slot.status === 'reserved' ? 'text-yellow-700' :
        'text-gray-700'
      }`}>
        {getStatusText()}
      </p>
      
      {slot.vehicleNumber && (
        <p className="text-xs text-gray-500 mt-1">
          Vehicle: {slot.vehicleNumber}
        </p>
      )}
      
      {slot.reservedUntil && (
        <p className="text-xs text-gray-500 mt-1">
          Until: {new Date(slot.reservedUntil).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

