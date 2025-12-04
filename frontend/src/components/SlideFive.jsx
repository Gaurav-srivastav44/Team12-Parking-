import React from "react";

export default function SlideFive() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-bl from-[#b2f7ef] via-[#f7d6e0] to-[#fff6b7] px-6 md:px-14 py-10">
      {/* Animated pastel SVG blobs */}
      <svg className="absolute left-16 top-16 opacity-25 animate-pulse" width="100" height="100">
        <ellipse cx="50" cy="45" rx="40" ry="35" fill="#eb34b6" fillOpacity="0.3" />
      </svg>
      <svg className="absolute right-28 bottom-20 opacity-25 animate-pulse" width="90" height="90">
        <ellipse cx="45" cy="45" rx="35" ry="40" fill="#21e6c1" fillOpacity="0.2" />
      </svg>
      <svg className="absolute left-36 bottom-14 opacity-25 animate-pulse" width="120" height="120">
        <ellipse cx="60" cy="60" rx="50" ry="36" fill="#f8de22" fillOpacity="0.20" />
      </svg>
      {/* Noisy/Grain texture overlay using SVG */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-5" width="100%" height="100%">
        <filter id="grain" >
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.45 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* Content */}
      <div className="w-full md:w-[65%] space-y-8 ml-[85px] relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#7e2553] text-left">Slide Five</h1>
          <p className="text-xl font-semibold text-[#1b4965]">Pastel animated blobs &amp; noise overlays!</p>
        </div>
        <ul className="space-y-5 mt-4">
          <li className="text-lg text-[#663f46] font-medium">SVG oscillating ellipses</li>
          <li className="text-lg text-[#0d6efd] font-medium">Modern linear gradients</li>
          <li className="text-lg text-[#7e2553] font-medium">Subtle noise/grain texture overlay</li>
        </ul>
      </div>
    </div>
  );
}

