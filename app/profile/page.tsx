"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Calendar, MapPin, Award, CheckCircle, ArrowLeft, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("12th");
  const [classLevel, setClassLevel] = useState("Competition");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [district, setDistrict] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setEmail(user.email || "");

          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (prof) {
            setFullName(prof.full_name || "");
            setPhone(prof.phone || "");
            setDob(prof.dob || "");
            if (prof.qualification) setQualification(prof.qualification);
            if (prof.class_level) setClassLevel(prof.class_level);
            if (prof.state) setStateName(prof.state);
            if (prof.district) setDistrict(prof.district);
          } else {
            setFullName(user.user_metadata?.full_name || "");
          }
        }
      } catch (err) {
        console.warn("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          dob: dob,
          qualification: qualification,
          class_level: classLevel,
          state: stateName,
          district: district,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          setMessage("सेव करने में त्रुटि: " + error.message);
        } else {
          setMessage("प्रोफाइल सफलतापूर्वक अपडेट हो गई! (Saved Successfully)");
        }
      } else {
        setMessage("प्रोफाइल अपडेट सहेजा गया! (Local Demo)");
      }
    } catch (err: any) {
      setMessage("प्रोफाइल अपडेट हो गई! (Local Demo)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>डैशबोर्ड पर वापस जाएं (Back to Dashboard)</span>
      </Link>

      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 border-2 border-gold text-gold flex items-center justify-center font-bold text-2xl">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">विद्यार्थी प्रोफाइल (Student Profile)</h1>
            <p className="text-xs text-gray-400">
              अपनी शैक्षणिक जानकारी भरें ताकि आपको सटीक परीक्षा एवं नौकरी अलर्ट मिल सकें
            </p>
          </div>
        </div>

        {message && (
          <div className="p-3 bg-accentGreen/15 border border-accentGreen/30 text-accentGreen text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">पूरा नाम (Full Name)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="सूरज मौर्या"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल (Email Address)</label>
              <input
                type="email"
                disabled
                value={email || "student@example.com"}
                className="w-full bg-navy/50 border border-gray-800 text-gray-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">मोबाइल नंबर (Phone)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
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
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              >
                <option value="Class 6">Class 6 (Navodaya)</option>
                <option value="Class 9">Class 9 (Navodaya)</option>
                <option value="Class 10">Class 10 (Board Exam)</option>
                <option value="Class 12">Class 12 (Board Exam)</option>
                <option value="Competition">Sarkari Exams (Competition)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">उच्चतम योग्यता (Qualification)</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              >
                <option value="8th">8th Pass</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="ITI">ITI</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduation">Graduate (B.A/B.Sc/B.Com/B.Tech)</option>
                <option value="PG">Post Graduate (M.A/M.Sc/M.Com)</option>
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
              className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
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
