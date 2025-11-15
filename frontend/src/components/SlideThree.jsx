import React from "react";

export default function SlideThree() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-tl from-[#bae6fd] via-[#818cf8] to-[#d8b4fe] px-6 md:px-14 py-10">
      {/* Network Dots + Lines Pattern */}
      <svg className="absolute left-0 top-0 w-96 h-96 opacity-25" width="400" height="400">
        {[...Array(7)].map((_, i) => (
          <circle key={i} cx={60 + 50*i} cy={40 + (i%2)*120} r="19" fill="#4338ca" />
        ))}
        <line x1="60" y1="40" x2="310" y2="160" stroke="#06b6d4" strokeWidth="7" />
        <line x1="110" y1="160" x2="360" y2="40" stroke="#f472b6" strokeWidth="7" />
      </svg>
      {/* Triangles upper right */}
      <svg className="absolute right-8 top-8 opacity-25" width="110" height="110">
        <polygon points="20,100 80,20 100,90" fill="#06b6d4" />
        <polygon points="30,60 90,30 60,80" fill="#7c3aed" />
      </svg>
      {/* Fluid Bezier Curve at bottom */}
      <svg className="absolute left-0 bottom-0 opacity-30" width="600" height="160">
        <path d="M0 130 Q 150 5 300 120 T 600 115 L600 160 L0 160Z" fill="#0ea5e9" />
      </svg>
      {/* Content - can be text or anything else */}
      <div className="w-full md:w-[60%] space-y-8 ml-[40px] relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#312e81] text-left">Slide Three</h1>
          <p className="text-xl font-semibold text-[#5a50a2]">A completely new pattern with network and triangles</p>
        </div>
        <ul className="space-y-5 mt-4">
          <li className="text-lg text-[#155e75] font-medium">Network node backgrounds</li>
          <li className="text-lg text-[#da2629] font-medium">Triangles and bezier shapes</li>
          <li className="text-lg text-[#44403c] font-medium">Modern pastel gradients</li>
        </ul>
      </div>
    </div>
  );
}
