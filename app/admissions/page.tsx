"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, ExternalLink, Calendar, Users, Award } from "lucide-react";

const ADMISSION_ITEMS = [
  {
    id: "adm-1",
    title: "Jawahar Navodaya Vidyalaya JNVST Class 6 Admission 2026-27",
    org: "Navodaya Vidyalaya Samiti",
    classLevel: "कक्षा 6 (Class 6)",
    deadline: "10 Dec 2026",
    examDate: "20 Jan 2027",
    fee: "निःशुल्क (Free of cost education)",
    applyUrl: "https://cbseitms.rcil.gov.in/nvs",
  },
  {
    id: "adm-2",
    title: "Navodaya Vidyalaya Class 9 Lateral Entry Selection Test (LEST)",
    org: "Navodaya Vidyalaya Samiti",
    classLevel: "कक्षा 9 (Class 9)",
    deadline: "15 Dec 2026",
    examDate: "08 Feb 2027",
    fee: "निःशुल्क",
    applyUrl: "https://navodaya.gov.in",
  },
  {
    id: "adm-3",
    title: "All India Sainik School Entrance Examination (AISSEE) 2027",
    org: "National Testing Agency (NTA)",
    classLevel: "Class 6 & Class 9",
    deadline: "16 Dec 2026",
    examDate: "Jan 2027",
    fee: "General: ₹650 | SC/ST: ₹500",
    applyUrl: "https://exams.nta.ac.in/AISSEE",
  },
  {
    id: "adm-4",
    title: "UP Polytechnic JEECUP Diploma Entrance Exam 2027",
    org: "Joint Entrance Examination Council (UP)",
    classLevel: "10th / 12th Pass",
    deadline: "Jan 2027",
    examDate: "March 2027",
    fee: "Gen/OBC: ₹300 | SC/ST: ₹200",
    applyUrl: "https://jeecup.admissions.nic.in",
  },
  {
    id: "adm-5",
    title: "NCVT ITI Admission & Choice Filling 2026-27",
    org: "Ministry of Skill Development & Entrepreneurship",
    classLevel: "8th / 10th Pass",
    deadline: "Live Now",
    examDate: "Merit Based",
    fee: "State Govt Guidelines",
    applyUrl: "https://www.ncvtmis.gov.in",
  },
];

export default function AdmissionsPage() {
  const [search, setSearch] = useState("");

  const filtered = ADMISSION_ITEMS.filter((item) =>
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
            <span className="text-white">Admissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-emerald-400" />
            <span>स्कूल एवं कॉलेज प्रवेश सूचनाएं (Admissions 2026-27)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            जवाहर नवोदय विद्यालय, सैनिक स्कूल, पॉलिटेक्निक, आईटीआई एवं विश्वविद्यालय प्रवेश फॉर्म
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="नवोदय, सैनिक स्कूल, पॉलिटेक्निक खोजें..."
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
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {item.classLevel}
                </span>
                <span className="text-xs text-rose-400 font-semibold">
                  अंतिम तिथि: {item.deadline}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-gold transition">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400">{item.org}</p>

              <div className="grid grid-cols-2 gap-2 bg-navy/60 p-2.5 rounded-xl border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">प्रवेश परीक्षा:</span>
                  <span className="font-semibold text-white">{item.examDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">आवेदन शुल्क:</span>
                  <span className="font-semibold text-accentGreen">{item.fee}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">ऑनलाइन रजिस्ट्रेशन चालू</span>
              <a
                href={item.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <span>आवेदन फॉर्म भरें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
