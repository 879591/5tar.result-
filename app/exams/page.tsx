"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Search, Download, Calendar, ExternalLink, ArrowLeft } from "lucide-react";

const EXAM_ITEMS = [
  {
    id: "ex-1",
    title: "Navodaya Vidyalaya JNVST Class 6 Admit Card 2026",
    org: "Navodaya Vidyalaya Samiti (NVS)",
    examDate: "20 Jan 2027",
    status: "जारी है (Live Now)",
    downloadUrl: "https://navodaya.gov.in",
  },
  {
    id: "ex-2",
    title: "CTET December 2026 Pre Admit Card & Exam City Slip",
    org: "Central Board of Secondary Education (CBSE)",
    examDate: "14 Dec 2026",
    status: "उपलब्ध है",
    downloadUrl: "https://ctet.nic.in",
  },
  {
    id: "ex-3",
    title: "SSC CGL 2026 Tier-II Hall Ticket (All Regions)",
    org: "Staff Selection Commission",
    examDate: "18-20 Dec 2026",
    status: "जारी है (Live Now)",
    downloadUrl: "https://ssc.gov.in",
  },
  {
    id: "ex-4",
    title: "SBI Clerk Mains 2026 Call Letter",
    org: "State Bank of India",
    examDate: "28 Dec 2026",
    status: "शीघ्र जारी होगा",
    downloadUrl: "https://sbi.co.in",
  },
  {
    id: "ex-5",
    title: "UP Police Constable Re-Exam City Intimation Slip",
    org: "UPPRPB Lucknow",
    examDate: "23-25 Dec 2026",
    status: "सक्रिय है",
    downloadUrl: "https://uppbpb.gov.in",
  },
  {
    id: "ex-6",
    title: "UGC NET December 2026 Subject-wise Exam Schedule",
    org: "National Testing Agency (NTA)",
    examDate: "01-19 Jan 2027",
    status: "सूचना जारी",
    downloadUrl: "https://ugcnet.nta.ac.in",
  },
];

export default function ExamsPage() {
  const [search, setSearch] = useState("");

  const filtered = EXAM_ITEMS.filter((item) =>
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
            <span className="text-white">Exams & Admit Card</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-accentBlue" />
            <span>एडमिट कार्ड एवं परीक्षा तिथियां (Admit Cards 2026-27)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            प्रवेश पत्र, परीक्षा तिथि पत्र एवं सिटी इंटिमेशन स्लिप डाउनलोड लिंक
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="एडमिट कार्ड या परीक्षा का नाम खोजें..."
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
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-accentGreen/15 text-accentGreen border border-accentGreen/30">
                  {item.status}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  {item.examDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-gold transition">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400">{item.org}</p>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">परीक्षा तिथि: {item.examDate}</span>
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड करें</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
