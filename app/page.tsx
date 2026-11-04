"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, Bell, Sparkles, Briefcase, GraduationCap, FileText, 
  CheckCircle2, ArrowRight, BookOpen, Bot, Star, Calendar, 
  MapPin, ShieldAlert, Clock, ChevronRight, Award, Bookmark
} from "lucide-react";
import SaveJobButton from "@/components/SaveJobButton";
import AdBanner from "@/components/AdBanner";

// Initial verified sample data so users always see a rich, functioning portal
const FEATURED_NOTIFICATIONS = [
  { id: "1", text: "UP Police Constable Exam 2026 Revised Answer Key जारी", date: "Today", isNew: true },
  { id: "2", text: "Navodaya Vidyalaya JNVST Class 6 Admission 2026-27 प्रवेश पत्र डाउनलोड करें", date: "Today", isNew: true },
  { id: "3", text: "SSC GD Constable 2026 Online Form: कुल 45,000+ पद आमंत्रित", date: "Yesterday", isNew: false },
  { id: "4", text: "Railway RRB ALP & Technician Exam Stage-1 Result घोषित", date: "2 days ago", isNew: false },
];

const LATEST_JOBS = [
  {
    id: "job-1",
    title: "SSC GD Constable Recruitment 2026",
    department: "Staff Selection Commission (SSC)",
    qualification: "10th Pass",
    vacancies: "45,284 Posts",
    lastDate: "30 Nov 2026",
    state: "All India",
    isImportant: true,
  },
  {
    id: "job-2",
    title: "UP Police SI & Constable Direct Bharti 2026",
    department: "UPPRPB Lucknow",
    qualification: "12th / Graduate",
    vacancies: "12,500 Posts",
    lastDate: "15 Dec 2026",
    state: "Uttar Pradesh",
    isImportant: true,
  },
  {
    id: "job-3",
    title: "Railway RRB Group D & Technician Vacancy",
    department: "Railway Recruitment Board",
    qualification: "10th + ITI / Diploma",
    vacancies: "32,000 Posts",
    lastDate: "05 Jan 2027",
    state: "All India",
    isImportant: false,
  },
  {
    id: "job-4",
    title: "India Post GDS (Gramin Dak Sevak) 4th Merit List",
    department: "Department of Posts",
    qualification: "10th Pass",
    vacancies: "44,228 Posts",
    lastDate: "Active Now",
    state: "All States",
    isImportant: false,
  },
  {
    id: "job-5",
    title: "Airforce Agniveer Vayu Intake 01/2027",
    department: "Indian Air Force",
    qualification: "12th (PCM)",
    vacancies: "3,500 Posts",
    lastDate: "20 Dec 2026",
    state: "All India",
    isImportant: false,
  },
];

const ADMIT_CARDS = [
  { id: "admit-1", title: "Navodaya JNVST Class 6 Admit Card 2026", org: "NVS", releaseDate: "Live Now", examDate: "20 Jan 2027" },
  { id: "admit-2", title: "CTET December 2026 Hall Ticket", org: "CBSE", releaseDate: "Available", examDate: "14 Dec 2026" },
  { id: "admit-3", title: "SSC CGL Tier-II Admit Card", org: "SSC", releaseDate: "Live Now", examDate: "18-20 Dec 2026" },
  { id: "admit-4", title: "SBI Clerk Mains Call Letter 2026", org: "SBI", releaseDate: "Expected Soon", examDate: "28 Dec 2026" },
];

const RESULTS = [
  { id: "res-1", title: "Railway RRB Technician Stage-1 Result & Cut-off", org: "RRB", date: "Today", scoreLink: "#" },
  { id: "res-2", title: "UPSSSC PET 2026 Official Score Card", org: "UPSSSC", date: "Yesterday", scoreLink: "#" },
  { id: "res-3", title: "BPSC Teacher TRE 4.0 Final Merit List", org: "BPSC", date: "02 Nov", scoreLink: "#" },
  { id: "res-4", title: "CISF Head Constable Result & Cutoff Marks", org: "CISF", date: "01 Nov", scoreLink: "#" },
];

const ADMISSIONS = [
  { id: "adm-1", title: "Jawahar Navodaya Vidyalaya Class 6 Admission 2026-27", org: "NVS", eligibility: "Class 5 Passed", deadline: "10 Dec 2026" },
  { id: "adm-2", title: "Sainik School Entrance Exam (AISSEE) 2027", org: "NTA", eligibility: "Class 5 & 8 Passed", deadline: "16 Dec 2026" },
  { id: "adm-3", title: "UP Polytechnic JEECUP 2027 Application Form", org: "JEECUP", eligibility: "10th / 12th", deadline: "Jan 2027" },
  { id: "adm-4", title: "NCVT ITI Admission & Seat Allotment Phase-2", org: "NCVT MIS", eligibility: "8th / 10th", deadline: "Live Now" },
];

const MOCK_TESTS = [
  { id: "mock-1", title: "SSC GD Constable Full Length Test 01", questions: 80, time: "60 मिनट", language: "हिंदी / Eng", attempts: "14.2K" },
  { id: "mock-2", title: "Navodaya Class 6 Mental Ability + Maths", questions: 50, time: "60 मिनट", language: "हिंदी / Eng", attempts: "9.8K" },
  { id: "mock-3", title: "UP Police GK & Current Affairs Capsule", questions: 40, time: "30 मिनट", language: "हिंदी", attempts: "21.5K" },
  { id: "mock-4", title: "Railway General Science Special Test", questions: 50, time: "45 मिनट", language: "हिंदी / Eng", attempts: "12.0K" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = LATEST_JOBS.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.qualification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navyLight via-navy to-navy pt-8 pb-12 border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-gold" />
              <span>भारत का नंबर 1 सरकारी रिजल्ट एवं परीक्षा मंच</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              आपके सपनों की तैयारी, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-amber-500">
                एक ही जगह!
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              नवीनतम सरकारी नौकरियां (Jobs), प्रवेश पत्र (Admit Card), रिजल्ट (Results), 
              नवोदय प्रवेश, फ्री मॉक टेस्ट और स्टडी मटेरियल सबसे तेज और सटीक।
            </p>

            {/* Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-gray-700 focus-within:border-gold transition">
                <Search className="w-5 h-5 text-gray-400 absolute left-4" />
                <input
                  type="text"
                  placeholder="खोजें: SSC GD, UP Police, Navodaya, 10th Pass Job..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navyLight/90 text-white pl-12 pr-28 py-3.5 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-1.5 px-4 py-2 bg-gold hover:bg-yellow-400 text-navy font-bold rounded-xl text-xs sm:text-sm transition"
                >
                  खोजें
                </button>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
                <span className="text-gray-400">ट्रेंडिंग:</span>
                {["SSC GD 2026", "UP Police", "Navodaya Class 6", "Railway RRB", "10th Pass Jobs", "CTET Admit Card"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-navyLight/80 text-gray-300 hover:text-gold hover:border-gold/50 border border-gray-700/80 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flash Updates Marquee */}
          <div className="mt-8 bg-navyLight border border-gray-700/70 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 shadow-md">
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider shrink-0 bg-gold/10 px-3 py-1.5 rounded-lg border border-gold/30">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>ताज़ा अपडेट्स:</span>
            </div>
            <div className="flex-1 overflow-x-auto whitespace-nowrap text-xs text-gray-200 divide-x divide-gray-700 flex items-center gap-4 scrollbar-none">
              {FEATURED_NOTIFICATIONS.map((item) => (
                <div key={item.id} className="flex items-center gap-2 pl-4 shrink-0">
                  {item.isNew && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded font-black uppercase">
                      NEW
                    </span>
                  )}
                  <span className="hover:text-gold cursor-pointer transition">{item.text}</span>
                  <span className="text-gray-500 text-[10px]">({item.date})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-COLUMN SARKARI FAST ACCESS TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Results */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 px-4 py-3 text-white flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>परीक्षा परिणाम (Results)</span>
              </div>
              <Link href="/results" className="text-xs text-white/90 hover:underline">
                सभी देखें ›
              </Link>
            </div>
            <div className="p-4 divide-y divide-gray-800/80 flex-1">
              {RESULTS.map((res) => (
                <Link
                  key={res.id}
                  href="/results"
                  className="py-2.5 block group hover:bg-navy/40 px-2 rounded-lg transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-gold transition">
                      {res.title}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">{res.date}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{res.org}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 2: Admit Cards */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>प्रवेश पत्र (Admit Cards)</span>
              </div>
              <Link href="/exams" className="text-xs text-white/90 hover:underline">
                सभी देखें ›
              </Link>
            </div>
            <div className="p-4 divide-y divide-gray-800/80 flex-1">
              {ADMIT_CARDS.map((item) => (
                <Link
                  key={item.id}
                  href="/exams"
                  className="py-2.5 block group hover:bg-navy/40 px-2 rounded-lg transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-gold transition">
                      {item.title}
                    </p>
                    <span className="text-[10px] bg-accentGreen/20 text-accentGreen border border-accentGreen/30 px-1.5 py-0.2 rounded font-semibold shrink-0">
                      {item.releaseDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-0.5">
                    <span>{item.org}</span>
                    <span>परीक्षा: {item.examDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 3: Admissions */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-white flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>प्रवेश सूचनाएं (Admissions)</span>
              </div>
              <Link href="/admissions" className="text-xs text-white/90 hover:underline">
                सभी देखें ›
              </Link>
            </div>
            <div className="p-4 divide-y divide-gray-800/80 flex-1">
              {ADMISSIONS.map((item) => (
                <Link
                  key={item.id}
                  href="/admissions"
                  className="py-2.5 block group hover:bg-navy/40 px-2 rounded-lg transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-gold transition">
                      {item.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span className="text-emerald-400 font-medium">{item.eligibility}</span>
                    <span className="text-gray-500">अंतिम तिथि: {item.deadline}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Non-intrusive Ad Slot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="homepage-mid" format="horizontal" />
      </section>

      {/* LATEST JOBS FULL LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-gold" />
              <span>नवीनतम सरकारी नौकरियां (Latest Sarkari Jobs)</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              10वीं, 12वीं, आईटीआई, डिप्लोमा एवं ग्रेजुएट पदों के लिए तुरंत आवेदन करें
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-navyLight hover:bg-gray-800 text-gold text-xs font-semibold rounded-xl border border-gold/30 transition self-start sm:self-auto"
          >
            <span>सभी नौकरियां देखें ({LATEST_JOBS.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-navyLight border border-gray-800 hover:border-gold/40 rounded-2xl p-5 transition flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {job.qualification}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold" />
                      {job.state}
                    </span>
                    <SaveJobButton jobId={job.id} />
                  </div>
                </div>

                <Link href={`/jobs/${job.id}`}>
                  <h3 className="font-bold text-base text-white group-hover:text-gold transition line-clamp-2">
                    {job.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-400">{job.department}</p>

                <div className="bg-navy/70 p-2.5 rounded-xl text-xs space-y-1 border border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-gray-500">कुल पद:</span>
                    <span className="font-semibold text-accentGreen">{job.vacancies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">अंतिम तिथि:</span>
                    <span className="font-semibold text-rose-400">{job.lastDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-800/80 flex items-center justify-between">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
                >
                  <span>विस्तृत जानकारी</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-1.5 bg-gold hover:bg-yellow-400 text-navy text-xs font-bold rounded-lg transition"
                >
                  Apply Online
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOCK TESTS & PRACTICE ENGINE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navyLight via-[#102438] to-navy border border-gray-700/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accentGreen/10 border border-accentGreen/30 text-accentGreen text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>100% फ्री ऑनलाइन टेस्ट सीरीज</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                फ्री ऑनलाइन <span className="text-gold">मॉक टेस्ट</span> देकर अपनी रैंक जानें
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                रियल एग्जाम टाइमर, ऑल इंडिया पर्सेंटाइल और तुरंत विस्तृत हल के साथ टेस्ट दें। 
                SSC GD, Navodaya, UP Police और Railway के लिए विशेष टेस्ट उपलब्ध हैं।
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="/mock-tests"
                  className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center gap-2"
                >
                  <span>अभी टेस्ट शुरू करें</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/study-material"
                  className="px-6 py-3 bg-navy border border-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>स्टडी नोट्स डाउनलोड करें</span>
                </Link>
              </div>
            </div>

            {/* Test Cards mini showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:max-w-md">
              {MOCK_TESTS.slice(0, 4).map((test) => (
                <Link
                  key={test.id}
                  href={`/mock-tests/${test.id}`}
                  className="bg-navy/90 border border-gray-700/80 hover:border-gold/50 p-3.5 rounded-xl transition block group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-gold transition line-clamp-1">
                    {test.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                    <span>{test.questions} प्रश्न</span>
                    <span className="text-gold font-medium">{test.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                    <span>{test.language}</span>
                    <span className="text-accentGreen">{test.attempts} छात्र</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI HELP & GUIDANCE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-950/40 via-navyLight to-navy border border-purple-800/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">5tarResult AI विद्या सहायक (AI Exam Desk)</h3>
                <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full">
                  24x7 FREE
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                सिलेबस, योग्यता, परीक्षा पैटर्न या करियर मार्गदर्शन से जुड़ा कोई भी सवाल पूछें। 
                हमारा AI सहायक आपके सवालों का तुरंत हिंदी में जवाब देगा।
              </p>
            </div>
          </div>
          <Link
            href="/ai-help"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition shrink-0 flex items-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI से पूछें (Ask AI)</span>
          </Link>
        </div>
      </section>

      {/* FOUNDER & COMMUNITY TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold font-black text-2xl">
              SM
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="text-base font-bold text-white">Suraj Maurya</h4>
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold border border-gold/30">
                  संस्थापक (Founder)
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                &quot;हमारा लक्ष्य ग्रामीण और शहरी सभी भारतीय छात्रों तक सरकारी नौकरी व प्रवेश परीक्षाओं की विश्वसनीय सूचना सबसे पहले पहुंचाना है।&quot;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center bg-navy px-4 py-2.5 rounded-xl border border-gray-800">
              <div className="text-gold font-bold text-base">50,000+</div>
              <div className="text-gray-400 text-[10px]">सक्रिय विद्यार्थी</div>
            </div>
            <div className="text-center bg-navy px-4 py-2.5 rounded-xl border border-gray-800">
              <div className="text-accentGreen font-bold text-base">100%</div>
              <div className="text-gray-400 text-[10px]">निशुल्क एवं प्रामाणिक</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
