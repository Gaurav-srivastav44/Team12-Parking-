import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* ABOUT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sarkari Saathi</h3>
          <p className="text-gray-400 text-sm">
            Empowering citizens through digital access to government welfare.
          </p>
          <div className="flex gap-3 mt-4 text-xl text-gray-300">
            <FaFacebook className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/schemes" className="hover:text-white">All Schemes</a></li>
            <li><a href="/scholarships" className="hover:text-white">Scholarships</a></li>
            <li><a href="/loans" className="hover:text-white">Loans</a></li>
            <li><a href="/stories" className="hover:text-white">Success Stories</a></li>
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h4 className="font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Education</li>
            <li>Healthcare</li>
            <li>Employment</li>
            <li>Housing</li>
            <li>Women & Child</li>
            <li>Agriculture</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📞 Helpline: 1800-123-4567</li>
            <li>✉️ Email: help@sarkarisaathi.gov.in</li>
            <li>💬 WhatsApp: +91-98765-43210</li>
            <li>🏢 Office: New Delhi, India</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-xs">
        Privacy Policy | Terms of Service | Accessibility | Disclaimer
        <p className="mt-2">
          © {new Date().getFullYear()} Sarkari Saathi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
