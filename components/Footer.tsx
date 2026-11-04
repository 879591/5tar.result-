import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart, Shield, CheckCircle, ExternalLink, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07131e] border-t border-gray-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 p-0.5">
                <div className="w-full h-full bg-navy rounded-[10px] flex items-center justify-center">
                  <span className="text-gold font-bold text-xl">5★</span>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                5tar<span className="text-gold">Result</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              5tarResult.com भारत का विश्वसनीय शैक्षिक एवं सरकारी नौकरी अलर्ट पोर्टल है। 
              हम छात्रों को निःशुल्क, सटीक और सबसे तेज़ परीक्षा परिणाम, प्रवेश पत्र, और अध्ययन सामग्री प्रदान करते हैं।
            </p>
            <div className="pt-2 text-xs text-gold/90 font-medium flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span>संस्थापक: <strong>Suraj Maurya</strong></span>
            </div>
            <div className="text-xs text-gray-500">
              &quot;आपके सपनों की तैयारी, एक ही जगह!&quot;
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-gray-800 pb-2">
              महत्वपूर्ण लिंक्स (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> नवीनतम सरकारी नौकरियां (Latest Jobs)
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> परीक्षा परिणाम (Sarkari Results)
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> एडमिट कार्ड व परीक्षा तिथियां (Admit Cards)
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> नवोदय व स्कूल प्रवेश (Navodaya & Admissions)
                </Link>
              </li>
              <li>
                <Link href="/mock-tests" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> फ्री ऑनलाइन मॉक टेस्ट (Free Mock Tests)
                </Link>
              </li>
              <li>
                <Link href="/study-material" className="hover:text-gold transition flex items-center gap-1.5">
                  <span className="text-gold">›</span> स्टडी मटेरियल व पीडीएफ (Study Notes & PYQs)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories by Qualification */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-gray-800 pb-2">
              योग्यता अनुसार नौकरियां (By Qualification)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs?qual=10th" className="hover:text-gold transition">
                  • 10वीं पास नौकरियां (10th Pass Jobs)
                </Link>
              </li>
              <li>
                <Link href="/jobs?qual=12th" className="hover:text-gold transition">
                  • 12वीं पास नौकरियां (12th Pass Jobs)
                </Link>
              </li>
              <li>
                <Link href="/jobs?qual=ITI" className="hover:text-gold transition">
                  • आईटीआई / डिप्लोमा भर्ती (ITI & Diploma)
                </Link>
              </li>
              <li>
                <Link href="/jobs?qual=Graduation" className="hover:text-gold transition">
                  • स्नातक नौकरियां (Graduate Level Jobs)
                </Link>
              </li>
              <li>
                <Link href="/admissions?cat=Navodaya" className="hover:text-gold transition">
                  • नवोदय विद्यालय कक्षा 6 व 9 प्रवेश
                </Link>
              </li>
              <li>
                <Link href="/ai-help" className="hover:text-gold transition flex items-center gap-1 text-purple-400">
                  • AI परीक्षा सहायक (AI Exam Help Desk)
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-b border-gray-800 pb-2">
              अस्वीकरण (Disclaimer)
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              5tarResult.com एक गैर-सरकारी निजी सूचना पोर्टल है। यहाँ उपलब्ध कराई गई सभी जानकारियां केवल सूचनात्मक उद्देश्यों के लिए हैं। किसी भी निर्णय से पूर्व संबंधित विभाग की आधिकारिक विज्ञप्ति अवश्य देखें।
            </p>
            <div className="flex items-center gap-2 text-xs text-accentGreen bg-accentGreen/10 border border-accentGreen/20 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>100% सत्यापित एवं आधिकारिक स्रोत</span>
            </div>
          </div>
        </div>

        {/* Policy & AdSense Mandated Links Row */}
        <div className="border-t border-gray-800/80 pt-6 pb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
          <Link href="/about" className="hover:text-gold transition">हमारे बारे में (About Us)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/contact" className="hover:text-gold transition">संपर्क करें (Contact Us)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/privacy-policy" className="hover:text-gold transition">गोपनीयता नीति (Privacy Policy)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/terms" className="hover:text-gold transition">नियम व शर्तें (Terms)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/disclaimer" className="hover:text-gold transition">अस्वीकरण (Disclaimer)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/tools" className="hover:text-gold transition">छात्र टूल्स (Tools)</Link>
          <span className="text-gray-700">•</span>
          <Link href="/admin" className="text-gray-500 hover:text-gold transition">Admin Panel</Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 5tarResult. सर्वाधिकार सुरक्षित (All Rights Reserved).</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Indian Students | Founder: Suraj Maurya
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
