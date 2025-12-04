import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCar, FaDollarSign } from 'react-icons/fa';

export default function LotCard({ lot }) {
  const navigate = useNavigate();
  const occupancyRate = ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100;

  return (
    <div
      onClick={() => navigate(`/lot/${lot.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border border-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{lot.name}</h3>
      
      <div className="flex items-center text-gray-600 mb-3">
        <FaMapMarkerAlt className="mr-2" />
        <span className="text-sm">{lot.address}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <FaCar className="mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-lg font-semibold text-gray-800">{lot.availableSlots}/{lot.totalSlots}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FaDollarSign className="mr-2 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="text-lg font-semibold text-gray-800">${lot.pricePerHour}/hr</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${100 - occupancyRate}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">{Math.round(100 - occupancyRate)}% available</p>

      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  );
}

