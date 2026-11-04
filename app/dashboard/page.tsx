"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Bookmark, Award, Clock, User, 
  ArrowRight, Briefcase, FileText, CheckCircle 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [savedJobsCount, setSavedJobsCount] = useState(2);
  const [testAttemptsCount, setTestAttemptsCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (prof) setProfile(prof);

          const { count: sCount } = await supabase
            .from("saved_jobs")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          if (sCount !== null && sCount !== undefined) setSavedJobsCount(sCount);

          const { count: tCount } = await supabase
            .from("test_attempts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          if (tCount !== null && tCount !== undefined) setTestAttemptsCount(tCount);
        }
      } catch (err) {
        console.warn("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "प्रिय विद्यार्थी";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-navyLight via-[#102438] to-navy border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
            <span>विद्यार्थी डैशबोर्ड (Student Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            स्वागत है, <span className="text-gold">{displayName}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            आपकी परीक्षा तैयारी, सहेजे गए फॉर्म और मॉक टेस्ट स्कोर का लाइव डैशबोर्ड
          </p>
        </div>

        <Link
          href="/profile"
          className="px-4 py-2 bg-navy border border-gray-700 hover:border-gold text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition"
        >
          <User className="w-4 h-4 text-gold" />
          <span>प्रोफाइल सेटिंग्स (Profile)</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">सहेजी गई नौकरियां</span>
            <div className="p-2 bg-gold/10 text-gold rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{savedJobsCount}</div>
          <Link href="/jobs" className="text-xs text-gold hover:underline flex items-center gap-1 pt-1">
            <span>नौकरियां देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">दिए गए मॉक टेस्ट</span>
            <div className="p-2 bg-accentGreen/10 text-accentGreen rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{testAttemptsCount}</div>
          <Link href="/mock-tests" className="text-xs text-accentGreen hover:underline flex items-center gap-1 pt-1">
            <span>नया टेस्ट शुरू करें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">सक्रिय परीक्षा अलर्ट्स</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">4</div>
          <Link href="/exams" className="text-xs text-blue-400 hover:underline flex items-center gap-1 pt-1">
            <span>एडमिट कार्ड देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gold" />
            <span>आपके लिए सुझाई गई नौकरियां (Recommended Jobs)</span>
          </h3>
          <div className="space-y-3">
            {[
              { title: "SSC GD Constable 2026 Online Form", lastDate: "30 Nov 2026", id: "job-1" },
              { title: "UP Police SI Direct Bharti 2026", lastDate: "15 Dec 2026", id: "job-2" },
            ].map((j) => (
              <div
                key={j.id}
                className="bg-navy/70 p-3.5 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{j.title}</h4>
                  <span className="text-[10px] text-gray-400">अंतिम तिथि: {j.lastDate}</span>
                </div>
                <Link
                  href={`/jobs/${j.id}`}
                  className="px-3 py-1.5 bg-gold hover:bg-yellow-400 text-navy font-bold text-xs rounded-lg transition"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-accentGreen" />
            <span>अंतिम मॉक टेस्ट स्कोर (Recent Test Score)</span>
          </h3>
          <div className="bg-navy/70 p-4 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">SSC GD Live Mock Test 01</span>
              <span className="text-accentGreen font-bold bg-accentGreen/15 px-2 py-0.5 rounded">
                8.0 / 10 अंक
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-accentGreen h-full rounded-full" style={{ width: "80%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 pt-1">
              <span>सटीकता (Accuracy): 80%</span>
              <Link href="/mock-tests/mock-1" className="text-gold hover:underline">
                हल देखें ›
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
