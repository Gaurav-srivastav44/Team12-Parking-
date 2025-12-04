import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCar,
  FaDollarSign,
  FaChargingStation,
  FaWheelchair,
  FaUmbrellaBeach,
} from 'react-icons/fa';

const featureIcons = {
  covered: <FaUmbrellaBeach className="inline text-blue-500 mr-1" />,
  open: <FaCar className="inline text-green-500 mr-1" />,
  ev: <FaChargingStation className="inline text-emerald-500 mr-1" />,
  accessible: <FaWheelchair className="inline text-purple-500 mr-1" />,
  handicap: <FaWheelchair className="inline text-purple-500 mr-1" />,
};

export default function LotCard({
  lot,
  onDirections,
  onBook,
  showActions = true,
  showFeatures = true,
}) {
  const navigate = useNavigate();
  const occupancyRate = ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100;

  const handleDirections = (event) => {
    event.stopPropagation();
    onDirections?.(lot);
  };

  const handleBook = (event) => {
    event.stopPropagation();
    if (onBook) {
      onBook(lot);
    } else {
      navigate(`/lot/${lot.id}`);
    }
  };

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

      {showFeatures && lot.features && (
        <div className="flex flex-wrap gap-2 mb-4">
          {lot.features.map((feature) => (
            <span
              key={feature}
              className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
            >
              {featureIcons[feature] || null}
              {feature === 'ev' ? 'EV Charging' :
                feature === 'open' ? 'Open-Air' :
                feature === 'covered' ? 'Covered' :
                feature === 'accessible' || feature === 'handicap' ? 'Accessible' :
                feature}
            </span>
          ))}
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${Math.max(5, 100 - occupancyRate)}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">{Math.round(100 - occupancyRate)}% available</p>

      {showActions && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/lot/${lot.id}`);
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </button>
          <button
            onClick={handleBook}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Book Slot
          </button>
          <button
            onClick={handleDirections}
            className="w-full col-span-1 sm:col-span-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Get Directions
          </button>
        </div>
      )}
    </div>
  );
}

