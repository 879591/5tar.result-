"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, Mail, Phone, Calendar, MapPin, Award, CheckCircle, 
  ArrowLeft, Save, ShieldCheck, AlertCircle, Sparkles 
} from "lucide-react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("12th");
  const [classLevel, setClassLevel] = useState("Competition");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [district, setDistrict] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/?login=required";
            return;
          }
          throw new Error("प्रोफाइल लोड नहीं हो सकी");
        }
        const data = await res.json();
        if (data.profile) {
          setFullName(data.profile.fullName || "");
          setPhone(data.profile.phone || "");
          setEmail(data.profile.email || "");
          setDob(data.profile.dob || "2002-05-15");
          if (data.profile.qualification) setQualification(data.profile.qualification);
          if (data.profile.classLevel) setClassLevel(data.profile.classLevel);
          if (data.profile.state) setStateName(data.profile.state);
          if (data.profile.district) setDistrict(data.profile.district);
        }
      } catch (err: any) {
        setError(err?.message || "त्रुटि हुई");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          dob,
          qualification,
          classLevel,
          state: stateName,
          district,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "प्रोफाइल सहेजने में त्रुटि");
      }

      setMessage(data.message || "प्रोफाइल सफलतापूर्वक अपडेट हो गई!");
      
      // Update local storage and dispatch event to sync Header
      const existingUser = localStorage.getItem("5tar_user");
      if (existingUser) {
        try {
          const parsed = JSON.parse(existingUser);
          parsed.full_name = fullName;
          parsed.phone = phone;
          localStorage.setItem("5tar_user", JSON.stringify(parsed));
        } catch {}
      }
      window.dispatchEvent(new Event("auth-changed"));
    } catch (err: any) {
      setError(err?.message || "सहेजने में असमर्थ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">विद्यार्थी प्रोफाइल लोड हो रही है...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>डैशबोर्ड पर वापस जाएं (Back to Dashboard)</span>
      </Link>

      <div className="bg-navyLight border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 text-navy flex items-center justify-center font-black text-2xl shadow-lg shadow-gold/20">
              {fullName ? fullName.charAt(0) : "5"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-navy">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>विद्यार्थी प्रोफाइल (Student Profile)</span>
              <span className="text-[10px] font-bold text-gold bg-gold/15 border border-gold/30 px-2 py-0.5 rounded-full">
                सत्यापित
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              अपनी शैक्षणिक जानकारी भरें ताकि आपको सटीक परीक्षा एवं नौकरी अलर्ट मिल सकें
            </p>
          </div>
        </div>

        {message && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">पूरा नाम (Full Name)</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="अपना पूरा नाम लिखें"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">मोबाइल नंबर (Phone)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-9876543210"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल (Email Address)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-navy border border-gray-700 text-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">जन्म तिथि (Date of Birth)</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">शैक्षणिक स्तर (Target Level)</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold font-medium"
              >
                <option value="Competition">Sarkari Exams (SSC / Railway / Police)</option>
                <option value="Class 10">Class 10 (Board Exam)</option>
                <option value="Class 12">Class 12 (Board Exam)</option>
                <option value="Class 6">Class 6 (Navodaya Entrance)</option>
                <option value="Class 9">Class 9 (Navodaya Entrance)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">उच्चतम योग्यता (Qualification)</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold font-medium"
              >
                <option value="12th">12th Pass</option>
                <option value="10th">10th Pass</option>
                <option value="8th">8th Pass</option>
                <option value="ITI">ITI / Diploma</option>
                <option value="Graduation">Graduate (B.A / B.Sc / B.Com / B.Tech)</option>
                <option value="PG">Post Graduate (M.A / M.Sc / M.Com)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">राज्य (State)</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="उत्तर प्रदेश"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">जिला (District)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="उदा. वाराणसी / लखनऊ / पटना"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-gold/20 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "सुरक्षित हो रहा है..." : "प्रोफाइल सहेजें (Save Profile)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
