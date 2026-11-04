"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bookmark, Award, Clock, User, ArrowRight, Briefcase, 
  TrendingUp, TrendingDown, CheckCircle2, AlertCircle, 
  Calendar, BookOpen, Sparkles, ChevronRight, BarChart3, 
  ShieldCheck, RefreshCw, ExternalLink, Zap
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/dashboard-data");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/?login=required";
          return;
        }
        throw new Error("डेटा लोड करने में असमर्थ");
      }
      const json = await res.json();
      if (!json.authenticated) {
        window.location.href = "/?login=required";
        return;
      }
      setData(json);
    } catch (err: any) {
      setError(err?.message || "सर्वर से कनेक्ट करने में त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm font-medium">आपका व्यक्तिगत छात्र डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-2xl text-red-300 text-sm space-y-2">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p>{error || "कृपया डैशबोर्ड देखने के लिए लॉगिन करें।"}</p>
        </div>
        <Link
          href="/?login=required"
          className="inline-flex px-6 py-2.5 bg-gold hover:bg-yellow-400 text-navy font-bold rounded-xl text-xs transition shadow-lg"
        >
          लॉगिन पोर्टल पर जाएं
        </Link>
      </div>
    );
  }

  const { user, stats, savedJobs, recentMockTests, studyProgress, examAlerts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Student Hero Profile Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navyLight via-[#102438] to-navy border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 text-navy flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-gold/20">
                {user.fullName ? user.fullName.charAt(0) : "5"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-navy" title="मोबाइल सत्यापित">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>विद्यार्थी पोर्टल (Verified Student)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                स्वागत है, <span className="text-gold">{user.fullName}</span>!
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="font-mono">{user.phone}</span>
                <span>•</span>
                <span>लक्ष्य: <strong className="text-gray-200">{user.classLevel || "Sarkari Exams"}</strong></span>
                <span>•</span>
                <span>योग्यता: <strong className="text-gray-200">{user.qualification || "12th Pass"}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/profile"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-navy border border-gray-700 hover:border-gold text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition hover:bg-navyLight"
            >
              <User className="w-4 h-4 text-gold" />
              <span>प्रोफाइल एडिट करें</span>
            </Link>
            <Link
              href="/mock-tests"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-gold/20"
            >
              <Zap className="w-4 h-4" />
              <span>लाइव टेस्ट दें</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Detailed Stat Cards with Trend Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Saved Jobs */}
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md hover:border-gray-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">सहेजी गई नौकरियां (Saved)</span>
            <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{stats.savedJobsCount}</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              <span>{stats.savedJobsTrend}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">सक्रिय भर्तियां जिनकी अंतिम तिथि नजदीक है</p>
        </div>

        {/* Card 2: Mock Tests */}
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md hover:border-gray-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">पूर्ण किए गए टेस्ट (Tests)</span>
            <div className="w-9 h-9 rounded-xl bg-accentGreen/10 text-accentGreen flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{stats.mockTestsCount}</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              <span>{stats.mockTestsTrend}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">ऑल इंडिया रैंकिंग में रैंक सुधर रही है</p>
        </div>

        {/* Card 3: Average Accuracy */}
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md hover:border-gray-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">औसत सटीकता (Accuracy)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{stats.avgAccuracy}%</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              <span>{stats.accuracyTrend}</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${stats.avgAccuracy}%` }} />
          </div>
        </div>

        {/* Card 4: Study Hours */}
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md hover:border-gray-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">कुल अध्ययन समय (Hours)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{stats.totalStudyHours}h</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.studyHoursTrend}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">पाठ्यक्रम का 80% भाग कवर हो चुका है</p>
        </div>
      </div>

      {/* 3. Study Progress Trackers with Progress Bars */}
      <div className="bg-navyLight border border-gray-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span>विषयवार अध्ययन प्रगति (Subject-wise Study Progress)</span>
            </h2>
            <p className="text-xs text-gray-400">आपके परीक्षा पाठ्यक्रम का वास्तविक पूर्णता प्रतिशत</p>
          </div>
          <Link
            href="/study-material"
            className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>सभी नोट्स देखें (Study Notes)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studyProgress.map((sub: any, idx: number) => (
            <div
              key={idx}
              className="bg-navy/80 border border-gray-800/90 rounded-2xl p-4 space-y-3 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block text-sm">{sub.hindiName}</span>
                  <span className="text-[11px] text-gray-400">{sub.subject}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-gold">{sub.completionPercentage}%</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">{sub.trend}</span>
                </div>
              </div>

              {/* Progress Track Bar */}
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${sub.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${sub.completionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>
                  पूर्ण टॉपिक्स: <strong className="text-gray-200">{sub.completedTopics}</strong>/{sub.totalTopics}
                </span>
                <span>
                  समय: <strong className="text-gray-200">{sub.hoursSpent} घंटे</strong>
                </span>
                <Link href="/study-material" className="text-gold hover:underline font-medium">
                  रिवीजन करें ›
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Modern Grid-Based Layout: Saved Jobs & Recent Mock Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Jobs (Modern Grid Card Layout) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-gold" />
              <span>सहेजी गई सरकारी नौकरियां (Saved Jobs)</span>
            </h2>
            <Link href="/jobs" className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold">
              <span>सभी नौकरियां ({stats.savedJobsCount})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedJobs.map((job: any) => (
              <div
                key={job.id}
                className="bg-navyLight border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gold/50 transition group shadow-lg space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-navy text-gold border border-gold/20 text-[10px] font-bold uppercase tracking-wider">
                      {job.qualification} पास
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {job.vacancies} पद
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-gold transition line-clamp-2 leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 line-clamp-1">{job.department}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-800/80">
                  <div className="flex items-center justify-between text-[11px] text-gray-300">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>अंतिम तिथि:</span>
                    </span>
                    <span className="font-semibold text-amber-400">{job.lastDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-300">
                    <span className="text-gray-400">वेतन:</span>
                    <span className="font-mono text-gray-200">{job.salary}</span>
                  </div>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="w-full py-2 bg-navy hover:bg-gold hover:text-navy border border-gray-700 hover:border-gold text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>विवरण व आवेदन लिंक</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mock Tests (Modern Grid Card Layout) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-accentGreen" />
              <span>हालिया मॉक टेस्ट परिणाम (Recent Mock Tests)</span>
            </h2>
            <Link href="/mock-tests" className="text-xs text-accentGreen hover:underline flex items-center gap-1 font-semibold">
              <span>टेस्ट सीरीज ({stats.mockTestsCount})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentMockTests.map((t: any) => (
              <div
                key={t.id}
                className="bg-navyLight border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-accentGreen/50 transition shadow-lg space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-navy text-accentGreen border border-accentGreen/20 text-[10px] font-bold uppercase tracking-wider">
                      {t.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.5 rounded">
                      <TrendingUp className="w-3 h-3" />
                      <span>{t.trendValue}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                    {t.testTitle}
                  </h3>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-800/80">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-gray-400">प्राप्तांक (Score):</span>
                    <span className="text-base font-black text-accentGreen font-mono">
                      {t.score} <span className="text-xs font-normal text-gray-400">/ {t.totalMarks}</span>
                    </span>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>सटीकता (Accuracy):</span>
                      <strong className="text-white font-mono">{t.accuracy}%</strong>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-accentGreen h-full rounded-full" style={{ width: `${t.accuracy}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{t.timeSpentMinutes} मिनट</span>
                    </span>
                    <Link
                      href={`/mock-tests/${t.testId}`}
                      className="text-gold hover:underline font-bold"
                    >
                      हल देखें (Review) ›
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Active Exam Alerts & Deadlines */}
      <div className="bg-navyLight border border-gray-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>सक्रिय परीक्षा अलर्ट्स एवं समय सारणी (Exam Alerts & Notices)</span>
          </h2>
          <Link href="/exams" className="text-xs font-semibold text-blue-400 hover:underline">
            सभी एडमिट कार्ड ›
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {examAlerts.map((a: any) => (
            <div
              key={a.id}
              className="bg-navy p-4 rounded-2xl border border-gray-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  {a.type}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{a.title}</h4>
                <span className="text-[11px] text-gold font-medium block pt-1">{a.date}</span>
              </div>
              <span className="shrink-0 px-2 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 text-[10px] font-semibold rounded-md">
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
