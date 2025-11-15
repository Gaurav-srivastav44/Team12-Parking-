import React from "react";

export default function SlideTwo() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#fbc2eb] via-[#a6c1ee] to-[#fad0c4] px-6 md:px-14 py-10">

      {/* Wavy Pattern */}
      <svg className="absolute left-0 top-0 w-full h-44 opacity-20" viewBox="0 0 1440 320">
        <path fill="#651fff" fillOpacity="0.3" d="M0,256L80,266.7C160,277,320,299,480,282.7C640,267,800,213,960,176C1120,139,1280,117,1360,106.7L1440,96V0H1360C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0H0Z"></path>
      </svg>
      <svg className="absolute right-0 bottom-0 w-2/3 h-44 opacity-20 rotate-180" viewBox="0 0 1440 320">
        <path fill="#00e1d6" fillOpacity="0.3" d="M0,160L40,181.3C80,203,160,245,240,266.7C320,288,400,288,480,282.7C560,277,640,267,720,256C800,245,880,235,960,208C1040,181,1120,139,1200,128C1280,117,1360,139,1400,149.3L1440,160V320H1400C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320H0Z"></path>
      </svg>

      {/* Random Polygon shapes */}
      <svg className="absolute left-24 bottom-36 opacity-30" width="120" height="120">
        <polygon points="60,10 95,110 25,40 95,40 25,110" fill="#ec4899" />
      </svg>
      <svg className="absolute right-20 top-24 opacity-40" width="80" height="80">
        <polygon points="10,10 70,10 40,70" fill="#f59e42" />
      </svg>

      {/* Starburst effect */}
      <svg className="absolute left-40 top-24 opacity-30" width="140" height="140">
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={70}
            y1={70}
            x2={70 + 60 * Math.cos((i * 2 * Math.PI) / 12)}
            y2={70 + 60 * Math.sin((i * 2 * Math.PI) / 12)}
            stroke="#fb7185"
            strokeWidth="3"
          />
        ))}
      </svg>

      {/* Diagonal Transparent Bars */}
      <div className="absolute right-0 top-12 flex flex-col gap-7 pr-10 opacity-20">
        <div className="w-72 h-8 bg-gradient-to-r from-[#4f46e5]/20 to-[#38bdf8]/0 rotate-6 rounded-xl"></div>
        <div className="w-60 h-8 bg-gradient-to-r from-[#16a34a]/30 to-[#38bdf8]/0 -rotate-6 rounded-xl"></div>
      </div>

      {/* CONTENT - change as desired */}
      <div className="w-full md:w-[60%] space-y-8 ml-[60px] relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4f46e5] text-left">Slide Two</h1>
          <p className="text-xl font-semibold text-[#41497a]">Creative random patterns for hero backgrounds</p>
        </div>
        <ul className="space-y-5 mt-4">
          <li className="text-lg text-[#7c224e] font-medium">Wavy SVG gradients and polygons</li>
          <li className="text-lg text-[#bb370e] font-medium">Geometric visual effects</li>
          <li className="text-lg text-[#276c6c] font-medium">Fully responsive and layered</li>
        </ul>
      </div>
    </div>
  );
}
