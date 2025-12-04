import React from "react";

export default function ParkingMap({ lots = [], userLocation, onSelectLot }) {
  return (
    <div
      className="w-full h-[500px] rounded-xl border border-gray-300 relative bg-gray-100
      bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)]
      bg-[size:40px_40px]"
    >
      {/* User Location */}
      {userLocation && (
        <div
          className="absolute text-blue-600 font-bold"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "30px",
          }}
        >
          🧍
        </div>
      )}

      {/* Parking Lots */}
      {lots.map((lot, i) => (
        <div
          key={i}
          className="absolute text-green-700 cursor-pointer"
          onClick={() => onSelectLot(lot)}
          style={{
            left: `${(i * 13 + 20) % 80}%`,
            top: `${(i * 19 + 30) % 80}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
          }}
        >
          🅿️
        </div>
      ))}
    </div>
  );
}
