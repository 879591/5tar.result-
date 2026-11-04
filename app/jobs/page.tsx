"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, Search, Filter, MapPin, Calendar, 
  ChevronRight, ArrowLeft, Bookmark, ExternalLink 
} from "lucide-react";
import SaveJobButton from "@/components/SaveJobButton";

const ALL_JOBS = [
  {
    id: "job-1",
    title: "SSC GD Constable Recruitment 2026",
    department: "Staff Selection Commission (SSC)",
    qualification: "10th",
    state: "Central",
    vacancies: "45,284",
    lastDate: "30 Nov 2026",
    salary: "₹21,700 - ₹69,100",
    ageLimit: "18 - 23 वर्ष",
    category: "Defense / Police",
  },
  {
    id: "job-2",
    title: "UP Police SI & Constable Direct Bharti 2026",
    department: "UPPRPB Lucknow",
    qualification: "12th",
    state: "Uttar Pradesh",
    vacancies: "12,500",
    lastDate: "15 Dec 2026",
    salary: "₹21,700 - ₹58,000",
    ageLimit: "18 - 25 वर्ष",
    category: "State Police",
  },
  {
    id: "job-3",
    title: "Railway RRB Group D & Technician Vacancy",
    department: "Railway Recruitment Board",
    qualification: "ITI",
    state: "Central",
    vacancies: "32,000",
    lastDate: "05 Jan 2027",
    salary: "₹19,900 - ₹63,200",
    ageLimit: "18 - 33 वर्ष",
    category: "Railways",
  },
  {
    id: "job-4",
    title: "India Post GDS (Gramin Dak Sevak) 4th Merit List",
    department: "Department of Posts",
    qualification: "10th",
    state: "All India",
    vacancies: "44,228",
    lastDate: "Active Now",
    salary: "₹12,000 - ₹29,380",
    ageLimit: "18 - 40 वर्ष",
    category: "Postal",
  },
  {
    id: "job-5",
    title: "Airforce Agniveer Vayu Intake 01/2027",
    department: "Indian Air Force",
    qualification: "12th",
    state: "Central",
    vacancies: "3,500",
    lastDate: "20 Dec 2026",
    salary: "₹30,000 / month + allowances",
    ageLimit: "17.5 - 21 वर्ष",
    category: "Armed Forces",
  },
  {
    id: "job-6",
    title: "BPSC 71st Combined Competitive Exam (CCE)",
    department: "Bihar Public Service Commission",
    qualification: "Graduation",
    state: "Bihar",
    vacancies: "1,980",
    lastDate: "28 Dec 2026",
    salary: "Pay Level 7, 9",
    ageLimit: "20 - 37 वर्ष",
    category: "Civil Services",
  },
  {
    id: "job-7",
    title: "SBI PO Probationary Officer Recruitment",
    department: "State Bank of India",
    qualification: "Graduation",
    state: "Central",
    vacancies: "2,000",
    lastDate: "10 Dec 2026",
    salary: "₹65,000+ Gross",
    ageLimit: "21 - 30 वर्ष",
    category: "Banking",
  },
  {
    id: "job-8",
    title: "UPSSSC Junior Assistant & Clerk Recruitment",
    department: "UP Subordinate Services Selection Commission",
    qualification: "12th",
    state: "Uttar Pradesh",
    vacancies: "5,512",
    lastDate: "22 Dec 2026",
    salary: "₹5,200 - ₹20,200 GP 2000",
    ageLimit: "18 - 40 वर्ष",
    category: "Clerical",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [selectedQual, setSelectedQual] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  const filtered = ALL_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    const matchesQual =
      selectedQual === "all" || job.qualification.toLowerCase() === selectedQual.toLowerCase();
    const matchesState =
      selectedState === "all" || job.state.toLowerCase() === selectedState.toLowerCase();
    return matchesSearch && matchesQual && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <span className="text-white">Jobs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-gold" />
            <span>सरकारी नौकरियां (Latest Sarkari Jobs 2026-27)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            केंद्र एवं राज्य सरकार के सभी विभागों की सत्यापित विज्ञप्तियां एवं ऑनलाइन आवेदन
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="नौकरी या विभाग का नाम खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Qualification Filter */}
          <div>
            <select
              value={selectedQual}
              onChange={(e) => setSelectedQual(e.target.value)}
              className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
            >
              <option value="all">सभी योग्यताएं (All Qualifications)</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="ITI">ITI / Diploma</option>
              <option value="Graduation">Graduate / Degree</option>
              <option value="PG">Post Graduate</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
            >
              <option value="all">सभी राज्य / केंद्र (All States)</option>
              <option value="Central">Central / All India</option>
              <option value="Uttar Pradesh">उत्तर प्रदेश (UP)</option>
              <option value="Bihar">बिहार (Bihar)</option>
            </select>
          </div>
        </div>

        {/* Quick pill filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/80 text-xs">
          <span className="text-gray-400">त्वरित फिल्टर:</span>
          {["10th", "12th", "ITI", "Graduation"].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQual(selectedQual === q ? "all" : q)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedQual === q
                  ? "bg-gold text-navy font-bold"
                  : "bg-navy text-gray-300 hover:text-white border border-gray-700"
              }`}
            >
              {q} Pass
            </button>
          ))}
          {(selectedQual !== "all" || selectedState !== "all" || search !== "") && (
            <button
              onClick={() => {
                setSelectedQual("all");
                setSelectedState("all");
                setSearch("");
              }}
              className="text-xs text-rose-400 hover:underline ml-auto"
            >
              फिल्टर हटाएं (Reset)
            </button>
          )}
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-3">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          कुल {filtered.length} नौकरियां उपलब्ध हैं
        </div>

        {filtered.length === 0 ? (
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-12 text-center space-y-3">
            <p className="text-gray-400 text-sm">आपके द्वारा चुने गए फिल्टर से कोई नौकरी नहीं मिली।</p>
            <button
              onClick={() => {
                setSelectedQual("all");
                setSelectedState("all");
                setSearch("");
              }}
              className="px-4 py-2 bg-gold text-navy font-bold rounded-xl text-xs"
            >
              सभी नौकरियां दिखाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-navyLight border border-gray-800 hover:border-gold/40 rounded-2xl p-5 transition flex flex-col justify-between group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-gold/15 text-gold border border-gold/30">
                        {job.qualification} Pass
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-gray-400 bg-navy border border-gray-700">
                        {job.category}
                      </span>
                    </div>
                    <SaveJobButton jobId={job.id} />
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-gold transition">
                      {job.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-400 font-medium">{job.department}</p>

                  <div className="grid grid-cols-2 gap-2 bg-navy/60 p-3 rounded-xl text-xs border border-gray-800/80">
                    <div>
                      <span className="text-gray-500 block text-[10px]">कुल पद:</span>
                      <span className="font-bold text-accentGreen">{job.vacancies}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">वेतनमान (Salary):</span>
                      <span className="font-medium text-gray-200">{job.salary}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">आयु सीमा:</span>
                      <span className="font-medium text-gray-200">{job.ageLimit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">अंतिम तिथि:</span>
                      <span className="font-bold text-rose-400">{job.lastDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-800 flex items-center justify-between">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-xs text-gold hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>पूरी जानकारी व सिलेबस</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-1.5 bg-gold hover:bg-yellow-400 text-navy font-bold text-xs rounded-xl transition shadow"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
