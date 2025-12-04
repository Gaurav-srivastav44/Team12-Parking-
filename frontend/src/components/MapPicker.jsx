import React, { useState } from "react";

export default function MapPicker({ center = { lat: 28.6139, lng: 77.2090 }, onSelect }) {
  const [selected, setSelected] = useState(center);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    const lat = (y / rect.height) * 180 - 90;      
    const lng = (x / rect.width) * 360 - 180;

    const pos = { lat, lng };
    setSelected(pos);
    onSelect(pos);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-96 rounded-xl border border-gray-300 relative cursor-crosshair bg-gray-100 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"
    >
      {selected && (
        <div
          className="absolute text-red-600"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "32px",
          }}
        >
          📍
        </div>
      )}
    </div>
  );
}
