"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("पासवर्ड कम से कम 6 अक्षरों का होना आवश्यक है।");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "पासवर्ड अपडेट करने में त्रुटि हुई।");
      } else {
        setMessage("आपका पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।");
      }
    } catch (err: any) {
      setError(err.message || "त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-navyLight border border-gray-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gold/15 text-gold border border-gold/40 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">नया पासवर्ड बनाएं (Reset Password)</h1>
          <p className="text-xs text-gray-400">
            कृपया अपने खाते के लिए एक नया और सुरक्षित पासवर्ड दर्ज करें
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-950/50 border border-red-800 text-red-200 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs p-3 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
            <Link
              href="/"
              className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>मुख्य पृष्ठ पर जाएं और लॉगिन करें</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">नया पासवर्ड (New Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="कम से कम 6 अक्षर"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
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
              <label className="block text-xs font-medium text-gray-300 mb-1">पासवर्ड कन्फर्म करें (Confirm Password)</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="दोबारा पासवर्ड दर्ज करें"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-gold/20"
            >
              {loading ? "पासवर्ड अपडेट हो रहा है..." : "पासवर्ड सुरक्षित करें (Save Password)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
