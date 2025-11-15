import React from "react";

export default function SlideFour() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-radial from-[#fdf6e3] to-[#ffc5e6] px-6 md:px-14 py-10">
      {/* Blurred Hexagons Pattern */}
      <svg className="absolute left-8 top-10 opacity-30" width="160" height="140">
        {[0, 1, 2, 3].map(i => (
          <polygon key={i}
            points="40,10 80,10 100,40 80,70 40,70 20,40"
            transform={`translate(${i*35},${i*22}) rotate(${i*15})`}
            fill="#ad1a72" fillOpacity={0.13 + 0.07*i}
            style={{ filter: "blur(2.5px)" }}
          />
        ))}
      </svg>
      {/* Floating squiggle */}
      <svg className="absolute right-28 top-16 opacity-30" width="135" height="100">
        <path d="M10,70 Q50,20 70,50 T120,30" stroke="#eab308" strokeWidth="8" fill="none" />
      </svg>
      {/* Pastel circles */}
      <div className="absolute right-10 bottom-32 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl"></div>
      <div className="absolute left-32 bottom-2 w-52 h-52 bg-violet-100/60 rounded-full blur-2xl"></div>
      {/* Content */}
      <div className="w-full md:w-[68%] space-y-8 ml-[80px] relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#ad1a72] text-left">Slide Four</h1>
          <p className="text-xl font-semibold text-[#892439]">Blurred hexagons, squiggle, and modern radial gradients!</p>
        </div>
        <ul className="space-y-5 mt-4">
          <li className="text-lg text-[#ad1a72] font-medium">Polygon & hex motifs with soft edges</li>
          <li className="text-lg text-[#f59e42] font-medium">Yellow squiggly SVG accent</li>
          <li className="text-lg text-[#a21caf] font-medium">Radial pastel gradients and floating blur</li>
        </ul>
      </div>
    </div>
  );
}
