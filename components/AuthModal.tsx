"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Mail, Lock, Phone, User, Eye, EyeOff, AlertCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, Clock, RefreshCw, KeyRound, Sparkle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"phone" | "login" | "signup" | "forgot">("phone");
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
  const [missingConfig, setMissingConfig] = useState(false);
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Indian mobile regex: 10 digits starting with 6, 7, 8, or 9
  const isIndianMobileValid = (num: string) => /^[6-9]\d{9}$/.test(num);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTab(initialMode === "signup" ? "signup" : "phone");
      setErrorMessage("");
      setSuccessMessage("");
      setMissingConfig(false);
      setTestOtpNotice(null);
      setOtpSent(false);
      setOtpCode("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhoneNumber("");
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

  // 1. EMAIL LOGIN VIA SERVER API (/api/auth/login)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setMissingConfig(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({
        success: false,
        error: "सर्वर से कनेक्ट करने में विफल।",
      }));

      if (!data.success) {
        setErrorMessage(data.error || "लॉगिन विफल रहा। कृपया पुनः प्रयास करें।");
        return;
      }

      setSuccessMessage(data.message || "लॉगिन सफल! स्वागत है 5tarResult में।");
      if (data.user) {
        localStorage.setItem("5tar_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-changed"));
      }
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message ? `त्रुटि: ${err.message}` : "सर्वर से कनेक्ट करने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  // 2. EMAIL SIGNUP VIA SERVER API (/api/auth/signup)
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setMissingConfig(false);

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          fullName: fullName.trim() || undefined,
          qualification: qualification,
          classLevel: selectedClass,
        }),
      });

      const data = await res.json().catch(() => ({
        success: false,
        error: "सर्वर से कनेक्ट करने में विफल।",
      }));

      if (!data.success) {
        setErrorMessage(data.error || "पंजीकरण में त्रुटि हुई।");
        return;
      }

      setSuccessMessage(data.message || "पंजीकरण सफल! आपका खाता बन गया है।");
      setTimeout(() => {
        setTab("login");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message ? `त्रुटि: ${err.message}` : "सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setLoading(false);
    }
  };

  // 3. FORGOT PASSWORD
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
      setErrorMessage(err?.message || "त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  // 4. REAL SMS OTP SEND VIA /api/auth/send-otp
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setMissingConfig(false);
    setTestOtpNotice(null);

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!isIndianMobileValid(cleanPhone)) {
      setErrorMessage("कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से हो)।");
      return;
    }

    if (phoneMode === "register" && !fullName.trim()) {
      setErrorMessage("कृपया अपना पूरा नाम लिखें।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json().catch(() => ({
        success: false,
        error: "सर्वर से अमान्य उत्तर प्राप्त हुआ।",
      }));

      if (data.success) {
        setOtpSent(true);
        setCooldown(data.cooldownSeconds || 60);

        if (data.previewMode && data.testOtp) {
          setTestOtpNotice(data.testOtp);
          setOtpCode(data.testOtp); // Auto fill for immediate 1-click test in preview mode
          setSuccessMessage(
            `परीक्षण मोड: OTP कोड ${data.testOtp} तैयार है। (लाइव SMS के लिए Vercel में FAST2SMS_API_KEY सेट करें)`
          );
        } else {
          setSuccessMessage(data.message || "OTP आपके मोबाइल नंबर पर SMS द्वारा भेज दिया गया है।");
        }
      } else {
        if (data.requiresConfig) {
          setMissingConfig(true);
        }
        setErrorMessage(data.error || "OTP भेजने में त्रुटि हुई।");
        if (data.retryAfter) {
          setCooldown(data.retryAfter);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message ? `त्रुटि: ${err.message}` : "सर्वर से संपर्क करने में असमर्थ। कृपया नेटवर्क जांचें।");
    } finally {
      setLoading(false);
    }
  };

  // 5. REAL SMS OTP VERIFY VIA /api/auth/verify-otp
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (otpCode.length !== 6) {
      setErrorMessage("कृपया 6 अंकों का सही OTP कोड दर्ज करें।");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber.replace(/\D/g, ""),
          otp: otpCode.trim(),
          fullName: fullName.trim() || undefined,
          qualification: qualification,
          classLevel: selectedClass,
        }),
      });

      const data = await res.json().catch(() => ({
        success: false,
        error: "सत्यापन प्रक्रिया में त्रुटि।",
      }));

      if (data.success) {
        setSuccessMessage(data.message || "सत्यापन सफल! लॉगिन हो गया।");
        if (data.user) {
          localStorage.setItem("5tar_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("auth-changed"));
        }
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 700);
      } else {
        setErrorMessage(data.error || "अमान्य OTP कोड। कृपया सही 6-अंकीय कोड दर्ज करें।");
      }
    } catch (err: any) {
      setErrorMessage(err?.message ? `त्रुटि: ${err.message}` : "सत्यापन के दौरान त्रुटि हुई।");
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
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-navy border-b border-gray-800 text-xs font-semibold text-center">
          <button
            onClick={() => { setTab("phone"); setErrorMessage(""); setSuccessMessage(""); setMissingConfig(false); }}
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
            onClick={() => { setTab("login"); setErrorMessage(""); setSuccessMessage(""); setMissingConfig(false); }}
            className={`py-3 transition border-b-2 ${
              tab === "login"
                ? "border-gold text-gold bg-navyLight/40 font-bold"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            ईमेल लॉगिन
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMessage(""); setSuccessMessage(""); setMissingConfig(false); }}
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
            <div className="flex items-start gap-2 bg-red-950/60 border border-red-700/80 text-red-200 text-xs p-3 rounded-xl animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1">
                <span className="leading-relaxed block font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {testOtpNotice && (
            <div className="bg-yellow-500/10 border border-gold/70 text-gold text-xs p-3.5 rounded-xl space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1">
                  <Sparkle className="w-3.5 h-3.5" /> परीक्षण OTP कोड:
                </span>
                <span className="font-mono text-base font-extrabold bg-gold text-navy px-2 py-0.5 rounded tracking-widest">
                  {testOtpNotice}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-normal">
                यह डेमो/टेस्टिंग कोड अपने आप भर दिया गया है। लाइव SMS डिलीवरी के लिए Vercel में <code className="text-gold font-mono">FAST2SMS_API_KEY</code> जोड़ें।
              </p>
            </div>
          )}

          {missingConfig && !testOtpNotice && (
            <div className="bg-amber-950/50 border border-amber-600/70 text-amber-200 text-xs p-3 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-gold">
                <KeyRound className="w-4 h-4" />
                <span>Fast2SMS सेटअप निर्देश:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-300">
                असली SMS भेजने के लिए Fast2SMS API Key को Vercel Environment Variables या <code className="bg-navy px-1.5 py-0.5 rounded text-gold">.env.local</code> में <code className="bg-navy px-1.5 py-0.5 rounded text-gold">FAST2SMS_API_KEY</code> के रूप में जोड़ें।
              </p>
            </div>
          )}

          {successMessage && !testOtpNotice && (
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
                      onClick={() => { setPhoneMode("login"); setErrorMessage(""); }}
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
                      onClick={() => { setPhoneMode("register"); setErrorMessage(""); }}
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
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          पूरा नाम (Full Name) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="अपना पूरा नाम लिखें"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">लक्ष्य स्तर (Target)</label>
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="Competition">Sarkari Exams</option>
                            <option value="Class 10">Class 10 (Board)</option>
                            <option value="Class 12">Class 12 (Board)</option>
                            <option value="Class 6">Class 6 (Navodaya)</option>
                            <option value="Class 9">Class 9 (Navodaya)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">शैक्षणिक योग्यता</label>
                          <select
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="12th">12th Pass</option>
                            <option value="10th">10th Pass</option>
                            <option value="8th">8th Pass</option>
                            <option value="ITI">ITI / Diploma</option>
                            <option value="Graduation">Graduate</option>
                            <option value="Post-Graduation">Post Graduate</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      भारतीय मोबाइल नंबर (10-Digit Mobile Number) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-gold border-r border-gray-700 pr-2">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        autoComplete="off"
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={phoneNumber}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhoneNumber(digitsOnly);
                        }}
                        className="w-full bg-navy border border-gray-700 rounded-xl pl-14 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono tracking-wider"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1.5">
                      <span className="text-gray-400">
                        {phoneNumber.length > 0 && !isIndianMobileValid(phoneNumber) ? (
                          <span className="text-amber-400">नंबर 6, 7, 8 या 9 से शुरू होना चाहिए।</span>
                        ) : (
                          "Fast2SMS द्वारा सुरक्षित 6-अंकीय OTP भेजा जाएगा।"
                        )}
                      </span>
                      <span className={`font-mono text-xs ${phoneNumber.length === 10 ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                        {phoneNumber.length}/10
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cooldown > 0 || !isIndianMobileValid(phoneNumber)}
                    className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold disabled:opacity-40 text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "OTP तैयार हो रहा है..."
                    ) : cooldown > 0 ? (
                      `पुनः OTP भेजें (${cooldown}s)`
                    ) : (
                      <>
                        <span>OTP कोड प्राप्त करें (Get OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                  <div className="bg-navy p-3 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 block text-[10px]">मोबाइल नंबर:</span>
                      <span className="font-mono font-bold text-white text-sm">+91-{phoneNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setErrorMessage("");
                        setTestOtpNotice(null);
                      }}
                      className="text-xs text-gold hover:underline font-semibold"
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
                      autoComplete="one-time-code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-center text-2xl tracking-widest text-gold font-mono focus:outline-none focus:border-gold"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                      <span>वैधता: 5 मिनट</span>
                      {cooldown > 0 ? (
                        <span className="text-gray-500 flex items-center gap-1 font-mono">
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
                    className="w-full py-3 bg-gradient-to-r from-accentGreen to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl transition shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
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
                    onClick={() => { setTab("forgot"); setErrorMessage(""); setSuccessMessage(""); }}
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
                className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  पूरा नाम (Full Name) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="अपना पूरा नाम लिखें"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  ईमेल (Email Address) <span className="text-red-400">*</span>
                </label>
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">शैक्षणिक स्तर</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Competition">Sarkari Exams</option>
                    <option value="Class 10">Class 10 (Board)</option>
                    <option value="Class 12">Class 12 (Board)</option>
                    <option value="Class 6">Class 6 (Navodaya)</option>
                    <option value="Class 9">Class 9 (Navodaya)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">योग्यता</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="12th">12th Pass</option>
                    <option value="10th">10th Pass</option>
                    <option value="8th">8th Pass</option>
                    <option value="ITI">ITI</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Graduation">Graduation</option>
                    <option value="PG">Post Graduation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  पासवर्ड (Password) <span className="text-red-400">*</span>
                </label>
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
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  पासवर्ड की पुष्टि करें (Confirm Password) <span className="text-red-400">*</span>
                </label>
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
                className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
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
                className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition cursor-pointer"
              >
                {loading ? "भेज रहे हैं..." : "रीसेट लिंक भेजें"}
              </button>
              <button
                type="button"
                onClick={() => { setTab("login"); setErrorMessage(""); setSuccessMessage(""); }}
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
