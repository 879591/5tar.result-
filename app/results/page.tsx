"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Search, ExternalLink, Calendar, Award } from "lucide-react";

const RESULTS_ITEMS = [
  {
    id: "r-1",
    title: "Railway RRB ALP & Technician Stage-1 CBT Result 2026",
    org: "Railway Recruitment Board",
    date: "आज जारी (Today)",
    cutOff: "UR: 68.4 | OBC: 64.2 | SC: 56.8",
    url: "https://indianrailways.gov.in",
  },
  {
    id: "r-2",
    title: "UPSSSC Preliminary Eligibility Test (PET) 2026 Result & Score Card",
    org: "UP Subordinate Services Selection Commission",
    date: "03 Nov 2026",
    cutOff: "Scorecard Live",
    url: "https://upsssc.gov.in",
  },
  {
    id: "r-3",
    title: "BPSC School Teacher TRE 4.0 Final Merit List",
    org: "Bihar Public Service Commission",
    date: "02 Nov 2026",
    cutOff: "Subject-wise Cutoff PDF Live",
    url: "https://bpsc.bih.nic.in",
  },
  {
    id: "r-4",
    title: "CISF Head Constable Ministerial Final Selection List 2026",
    org: "Central Industrial Security Force",
    date: "01 Nov 2026",
    cutOff: "Gen: 79.5 | OBC: 76.0",
    url: "https://cisfrectt.cisf.gov.in",
  },
  {
    id: "r-5",
    title: "SSC CPO SI Paper-I Result & Marks List 2026",
    org: "Staff Selection Commission",
    date: "28 Oct 2026",
    cutOff: "Male: 115.04 | Female: 126.13",
    url: "https://ssc.gov.in",
  },
];

export default function ResultsPage() {
  const [search, setSearch] = useState("");

  const filtered = RESULTS_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.org.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <span className="text-white">Results</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-rose-500" />
            <span>परीक्षा परिणाम (Sarkari Results & Cut-off 2026)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            विभिन्न प्रतियोगी परीक्षाओं के कट-ऑफ अंक एवं मेरिट सूची डाउनलोड करें
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="रिजल्ट या विभाग खोजें..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-navyLight border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-navyLight border border-gray-800 hover:border-gold/40 rounded-2xl p-5 transition flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {item.date}
                </span>
                <span className="text-xs text-gray-400 font-medium">{item.org}</span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-gold transition">
                {item.title}
              </h3>

              <div className="bg-navy/70 p-2.5 rounded-xl border border-gray-800 text-xs">
                <span className="text-gray-400 block text-[10px]">कट-ऑफ मार्क्स (Cut-off):</span>
                <span className="font-semibold text-gold mt-0.5 block">{item.cutOff}</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-accentGreen flex items-center gap-1 font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>मेरिट लिस्ट सक्रिय</span>
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <span>रिजल्ट देखें (Check Result)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
