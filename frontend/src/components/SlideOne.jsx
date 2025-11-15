import React from "react";
import labour from "../assets/images/labour.png";
import { FaGraduationCap, FaRupeeSign, FaAward } from "react-icons/fa";


export default function SlideOne() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#9be7f8] to-[#d6eff0] px-6 md:px-14 py-10">

      {/* ======================================================
          BACKGROUND PATTERNS
      ====================================================== */}
      


      {/* Soft Glow Circles */}
      <div className="absolute -right-20 top-10 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      <div className="absolute left-0 -top-10 w-72 h-72 bg-white/20 rounded-full blur-2xl"></div>

      {/* Left Hollow Circle */}
      <div className="absolute left-0 bottom-0 opacity-40">
        <svg width="130" height="80">
          <circle cx="65" cy="65" r="55" stroke="#0b4f6c" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* Three Small Hollow Circles */}
      <div className="absolute left-10 top-64 opacity-40 space-y-4">
        {[1, 2, 3].map((i) => (
          <svg key={i} width="40" height="40">
            <circle cx="20" cy="20" r="18" stroke="#0b4f6c" strokeWidth="3" fill="none" />
          </svg>
        ))}
      </div>

      {/* Left Vertical Lines */}
      <div className="absolute left-0 top-24 opacity-30">
        <svg width="80" height="300">
          <line x1="20" y1="0" x2="20" y2="300" stroke="#0b4f6c" strokeWidth="4" strokeDasharray="10 10" />
          <line x1="50" y1="0" x2="50" y2="300" stroke="#0b4f6c" strokeWidth="4" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Dotted Pattern Right */}
      <div className="absolute right-10 top-20 opacity-50">
        <svg width="150" height="150">
          <defs>
            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#0b4f6c" />
            </pattern>
          </defs>
          <rect width="150" height="150" fill="url(#dots)" />
        </svg>
      </div>

      {/* White Diagonal Bottom-Left Strips */}
      <div className="absolute left-0 top-1/2 translate-y-[-50px] rotate-[35deg] opacity-30">
        <svg width="600" height="600">
          <line x1="0" y1="0" x2="600" y2="400" stroke="white" strokeWidth="6" />
          <line x1="-40" y1="40" x2="560" y2="440" stroke="white" strokeWidth="6" />
          <line x1="-80" y1="80" x2="520" y2="480" stroke="white" strokeWidth="6" />
        </svg>
      </div>

      {/* Bottom-Left Glow */}
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-white/20 blur-2xl rounded-full opacity-40"></div>

      {/* ======================================================
          CONTENT SECTION
      ====================================================== */}

      <div className="w-full md:w-[70%] space-y-8 ml-[80px] relative z-10">

        {/* MAIN TITLE + HINDI TAGLINE + SUBTITLE */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#09345c] text-left">
            PM–YASASVI
          </h1>

          <p className="text-lg md:text-xl font-bold text-[#0a2742] text-left">
            प्रधानमंत्री यशस्वी छात्रवृत्ति योजना
          </p>

          <p className="text-xl md:text-2xl font-semibold text-[#09345c] text-left">
            for OBC | EBC | DNT Students
          </p>
        </div>

        {/* BULLET POINTS SECTION */}
        <div className="space-y-8">

          {/* POINT 1 */}
          <div className="flex items-start gap-4">
            <FaGraduationCap className="text-4xl text-[#09345c]" />
            <div>
              <p className="text-xl font-semibold text-[#09345c] leading-snug">
                  जीवंत भारत के लिए युवा उपलब्धि छात्रवृत्ति योजना

              </p>
            </div>
          </div>

          {/* POINT 2 */}
          <div className="flex items-start gap-4">
            <FaRupeeSign className="text-4xl text-[#09345c]" />
            <div>
              <p className="text-xl font-semibold text-[#09345c] leading-snug">
                आर्थिक रूप से कमजोर परिवारों को गुणवत्तापूर्ण शिक्षा प्राप्त करने में सहायता
              </p>
            </div>
          </div>

          {/* POINT 3 */}
          <div className="flex items-start gap-4">
            <FaAward className="text-4xl text-[#09345c]" />
            <div>
              <p className="text-xl font-semibold text-[#09345c] leading-snug">
                भारत की अगली पीढ़ी के प्रतिभाशाली छात्रों को सशक्त बनाना
              </p>
            </div>
          </div>

        </div>

        {/* BUTTON */}
        <a
  href="#apply"
  className="block w-fit bg-[#09345c] text-white px-10 py-3 rounded-xl shadow-lg 
             text-lg font-semibold hover:bg-[#072a4a] transition-all">
  Know More →
</a>


      </div>

      {/* RIGHT IMAGE BUBBLE */}
      <div className="absolute right-10 bottom-10 flex items-end z-10">
        <div className="relative flex items-end">
          <div className="w-48 h-48 md:w-[460px] md:h-[460px] rounded-full overflow-hidden shadow-xl">
            <img src={labour} alt="labour" className="w-full h-full object-cover" />
          </div>

          <div className="absolute -top-10 right-0 w-40 h-40 bg-white/25 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-16 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

    </div>
  );
}
