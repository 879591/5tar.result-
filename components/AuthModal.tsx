"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Mail, Lock, Phone, User, Eye, EyeOff, AlertCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, Clock, RefreshCw 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup" | "forgot" | "phone">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [qualification, setQualification] = useState("12th");
  const [selectedClass, setSelectedClass] = useState("Competition");
  const [phoneMode, setPhoneMode] = useState<"login" | "register">("login");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync mode when opened
  useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setErrorMessage("");
      setSuccessMessage("");
      setOtpSent(false);
      setOtpCode("");
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (!isOpen) return null;

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("गलत ईमेल या पासवर्ड! कृपया दोबारा जांचें। (Invalid credentials)");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("कृपया पहले अपने ईमेल में आए लिंक से सत्यापन करें। (Email not confirmed)");
        } else {
          setErrorMessage(error.message || "लॉगिन करने में त्रुटि हुई।");
        }
      } else {
        setSuccessMessage("लॉगिन सफल! स्वागत है 5tarResult में।");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "सर्वर से कनेक्ट करने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            qualification: qualification,
            class_level: selectedClass,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "रजिस्ट्रेशन विफल रहा।");
      } else {
        setSuccessMessage(
          "रजिस्ट्रेशन सफल! कृपया अपने इनबॉक्स में जाकर ईमेल की पुष्टि करें (Verify Email)।"
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message || "पासवर्ड रीसेट लिंक भेजने में त्रुटि हुई।");
      } else {
        setSuccessMessage("पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  // REAL SMS OTP SEND VIA /api/auth/send-otp
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setCooldown(data.cooldownSeconds || 60);
        setSuccessMessage(data.message || "OTP आपके मोबाइल नंबर पर SMS द्वारा भेज दिया गया है।");
      } else {
        setErrorMessage(data.error || "OTP भेजने में त्रुटि हुई।");
        if (data.retryAfter) {
          setCooldown(data.retryAfter);
        }
      }
    } catch (err: any) {
      setErrorMessage("सर्वर से संपर्क करने में असमर्थ। कृपया अपना इंटरनेट जांचें।");
    } finally {
      setLoading(false);
    }
  };

  // REAL SMS OTP VERIFY VIA /api/auth/verify-otp
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode.trim(),
          fullName: fullName.trim() || undefined,
          qualification: qualification,
          classLevel: selectedClass,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(data.message || "सत्यापन सफल! लॉगिन हो गया।");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 800);
      } else {
        setErrorMessage(data.error || "अमान्य OTP कोड। कृपया सही 6-अंकीय कोड दर्ज करें।");
      }
    } catch (err: any) {
      setErrorMessage("सत्यापन के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-navyLight border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/60 bg-navy/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gold text-navy flex items-center justify-center font-bold text-sm">
              5★
            </span>
            <span className="font-bold text-white text-lg">
              5tar<span className="text-gold">Result</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-navy transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-navy border-b border-gray-800 text-xs font-semibold text-center">
          <button
            onClick={() => { setTab("phone"); setErrorMessage(""); setSuccessMessage(""); }}
            className={`py-3 transition border-b-2 flex items-center justify-center gap-1.5 ${
              tab === "phone"
                ? "border-gold text-gold bg-navyLight/40 font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>मोबाइल OTP</span>
          </button>
          <button
            onClick={() => { setTab("login"); setErrorMessage(""); setSuccessMessage(""); }}
            className={`py-3 transition border-b-2 ${
              tab === "login"
                ? "border-gold text-gold bg-navyLight/40 font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            ईमेल लॉगिन
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMessage(""); setSuccessMessage(""); }}
            className={`py-3 transition border-b-2 ${
              tab === "signup"
                ? "border-gold text-gold bg-navyLight/40 font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            ईमेल रजिस्टर
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-start gap-2 bg-red-950/50 border border-red-800/80 text-red-200 text-xs p-3 rounded-xl animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs p-3 rounded-xl animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* REAL MOBILE OTP TAB */}
          {tab === "phone" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Mode switch: Existing Login vs New Student Registration */}
                  <div className="flex bg-navy p-1 rounded-xl border border-gray-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPhoneMode("login")}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                        phoneMode === "login"
                          ? "bg-navyLight text-white font-bold border border-gray-700 shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      मौजूदा छात्र लॉगिन
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneMode("register")}
                      className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                        phoneMode === "register"
                          ? "bg-gold text-navy font-bold shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      नया छात्र रजिस्ट्रेशन
                    </button>
                  </div>

                  {phoneMode === "register" && (
                    <div className="space-y-3 pt-1 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">पूरा नाम (Full Name)</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="सूरज मौर्या (Suraj Maurya)"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">स्तर (Target)</label>
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="Class 6">Class 6 (Navodaya)</option>
                            <option value="Class 9">Class 9 (Navodaya)</option>
                            <option value="Class 10">Class 10 (Board)</option>
                            <option value="Class 12">Class 12 (Board)</option>
                            <option value="Competition">Sarkari Exams</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">योग्यता (Qual)</label>
                          <select
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="8th">8th Pass</option>
                            <option value="10th">10th Pass</option>
                            <option value="12th">12th Pass</option>
                            <option value="ITI">ITI / Diploma</option>
                            <option value="Graduation">Graduate</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      भारतीय मोबाइल नंबर (10-Digit Mobile Number)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-gray-400 border-r border-gray-700 pr-2">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-navy border border-gray-700 rounded-xl pl-14 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono tracking-wider"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Fast2SMS गेटवे द्वारा इस नंबर पर असली 6-अंकीय SMS OTP भेजा जाएगा।
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cooldown > 0 || phoneNumber.length !== 10}
                    className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold disabled:opacity-40 text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "SMS भेजा जा रहा है..."
                    ) : cooldown > 0 ? (
                      `पुनः OTP भेजें (${cooldown}s)`
                    ) : (
                      <>
                        <span>असली SMS OTP भेजें (Send Real OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                  <div className="bg-navy p-3 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 block text-[10px]">OTP भेजा गया नंबर:</span>
                      <span className="font-mono font-bold text-white">+91-{phoneNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setErrorMessage("");
                      }}
                      className="text-xs text-gold hover:underline"
                    >
                      नंबर बदलें
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      प्राप्त हुआ 6 अंकों का OTP दर्ज करें
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="••••••"
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-gold font-mono focus:outline-none focus:border-gold"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span>वैधता: 5 मिनट</span>
                      {cooldown > 0 ? (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {cooldown}s में पुनः भेज सकते हैं
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="text-gold hover:underline font-semibold flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>OTP दोबारा भेजें (Resend)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-accentGreen to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl transition shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loading ? "जांच हो रही है..." : "OTP सत्यापित करें व लॉगिन करें"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* EMAIL LOGIN TAB */}
          {tab === "login" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल पता (Email)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-300">पासवर्ड (Password)</label>
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-[11px] text-gold hover:underline"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
              >
                {loading ? "प्रक्रिया जारी है..." : "लॉगिन करें (Sign In)"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* EMAIL SIGNUP TAB */}
          {tab === "signup" && (
            <form onSubmit={handleEmailSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">पूरा नाम (Full Name)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="सूरज मौर्या (Suraj Maurya)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल (Email Address)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">शैक्षणिक स्तर (Level)</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Class 6">Class 6 (Navodaya)</option>
                    <option value="Class 9">Class 9 (Navodaya)</option>
                    <option value="Class 10">Class 10 (Board)</option>
                    <option value="Class 12">Class 12 (Board)</option>
                    <option value="Competition">Sarkari Exams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">योग्यता (Qualification)</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="8th">8th Pass</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="ITI">ITI</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Graduation">Graduation</option>
                    <option value="PG">Post Graduation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">पासवर्ड (Password)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="न्यूनतम 6 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">पासवर्ड की पुष्टि करें (Confirm)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="दोबारा पासवर्ड दर्ज करें"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "खाता बन रहा है..." : "रजिस्ट्रेशन पूरा करें (Register)"}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD TAB */}
          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                अपना पंजीकृत ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे।
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल (Email Address)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition"
              >
                {loading ? "भेज रहे हैं..." : "रीसेट लिंक भेजें"}
              </button>
              <button
                type="button"
                onClick={() => setTab("login")}
                className="w-full text-xs text-center text-gray-400 hover:text-white"
              >
                वापस लॉगिन पर जाएं
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
