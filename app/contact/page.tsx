"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Query");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <span className="text-white">Contact Us</span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">संपर्क करें (Contact Us)</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          यदि आपके पास किसी भर्ती, एडमिट कार्ड, या स्टडी मटेरियल से संबंधित कोई प्रश्न या सुझाव है, तो कृपया नीचे दिए गए माध्यम से संपर्क करें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-2">
              सीधे संपर्क विवरण
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">आधिकारिक ईमेल</span>
                  <a href="mailto:contact@5tarresult.com" className="text-white hover:text-gold font-medium">
                    contact@5tarresult.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-accentGreen shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">छात्र सहायता डेस्क</span>
                  <span className="text-white">support@5tarresult.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">कार्य समय</span>
                  <span className="text-white">सोमवार - शनिवार: सुबह 10:00 से शाम 06:00</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">कार्यालय</span>
                  <span className="text-white">5tarResult Media & Education, Uttar Pradesh, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Query Form */}
        <div className="md:col-span-2 bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-accentGreen/15 text-accentGreen border border-accentGreen/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">संदेश सफलतापूर्वक प्राप्त हुआ!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                धन्यवाद! आपकी पूछताछ हमारी सहायता टीम को प्राप्त हो गई है। हम 24 से 48 घंटे के भीतर आपके ईमेल पते पर उत्तर देंगे।
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                  setName("");
                }}
                className="px-6 py-2.5 bg-gold text-navy font-bold rounded-xl text-xs"
              >
                नया संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-white">ऑनलाइन संदेश भेजें</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">आपका नाम (Full Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="सूरज मौर्या"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">ईमेल पता (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">विषय (Subject)</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                >
                  <option value="General Query">सामान्य पूछताछ (General Query)</option>
                  <option value="Job Alert Correction">भर्ती सूचना में सुधार / सुझाव</option>
                  <option value="Mock Test Feedback">मॉक टेस्ट से संबंधित प्रश्न</option>
                  <option value="Content Copyright">कॉपीराइट या सामग्री सुधार</option>
                  <option value="Advertising">विज्ञापन पूछताछ (Advertising & Partnerships)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">संदेश (Message)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="कृपया अपना सवाल या सुझाव विस्तार से लिखें..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>संदेश प्रेषित करें (Send Message)</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <AdBanner slot="contact-bottom" format="horizontal" />
    </div>
  );
}
