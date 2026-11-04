"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Briefcase, Calendar, MapPin, CheckCircle, FileText, 
  ExternalLink, ArrowLeft, Download, ShieldCheck, Share2 
} from "lucide-react";
import SaveJobButton from "@/components/SaveJobButton";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gold transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>सभी नौकरियों पर वापस जाएं (Back to Jobs)</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-gold/15 text-gold border border-gold/30">
                10th / 12th Pass
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accentGreen/15 text-accentGreen border border-accentGreen/30 font-semibold">
                आवेदन शुरू है
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              SSC GD Constable Bharti 2026: 45,284 पद
            </h1>
            <p className="text-sm text-gray-400">
              कर्मचारी चयन आयोग (Staff Selection Commission - SSC New Delhi)
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <SaveJobButton jobId={id || "job-1"} className="p-3" />
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "SSC GD 2026 Form", url: window.location.href });
                }
              }}
              className="p-3 bg-navy border border-gray-700 hover:text-gold rounded-xl transition text-gray-300"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center gap-3">
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl transition shadow-lg shadow-gold/20 flex items-center gap-2 text-sm"
          >
            <span>ऑनलाइन आवेदन करें (Apply Online)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-navy border border-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>आधिकारिक विज्ञप्ति (Notification PDF)</span>
          </a>
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 text-gray-400 hover:text-white text-xs underline"
          >
            आधिकारिक वेबसाइट (Official Website)
          </a>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Dates & Fees */}
        <div className="space-y-6">
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>महत्वपूर्ण तिथियां (Important Dates)</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex justify-between">
                <span className="text-gray-400">आवेदन प्रारंभ:</span>
                <span className="font-semibold text-white">01 Nov 2026</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">अंतिम तिथि:</span>
                <span className="font-bold text-rose-400">30 Nov 2026 (रात 11 बजे)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">शुल्क भुगतान अंतिम तिथि:</span>
                <span className="font-semibold text-white">01 Dec 2026</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">फॉर्म संशोधन (Correction):</span>
                <span className="font-semibold text-white">05-07 Dec 2026</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">सीबीटी परीक्षा तिथि:</span>
                <span className="font-bold text-gold">Jan - Feb 2027</span>
              </li>
            </ul>
          </div>

          <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accentGreen" />
              <span>आवेदन शुल्क (Application Fee)</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex justify-between">
                <span className="text-gray-400">General / OBC / EWS:</span>
                <span className="font-bold text-white">₹100/-</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">SC / ST / Ex-Servicemen:</span>
                <span className="font-bold text-accentGreen">₹0/- (निशुल्क)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">सभी श्रेणी की महिला अभ्यर्थी:</span>
                <span className="font-bold text-accentGreen">₹0/- (निशुल्क)</span>
              </li>
            </ul>
            <p className="text-[11px] text-gray-500 pt-1">
              भुगतान माध्यम: Net Banking, Debit Card, UPI, या SBI E-Challan द्वारा।
            </p>
          </div>
        </div>

        {/* Right Column: Eligibility, Physical, Selection */}
        <div className="md:col-span-2 space-y-6">
          {/* Eligibility */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gold" />
              <span>शैक्षणिक योग्यता एवं आयु सीमा (Eligibility & Age Limit)</span>
            </h3>
            <div className="text-xs sm:text-sm text-gray-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>शैक्षणिक योग्यता:</strong> भारत में किसी भी मान्यता प्राप्त बोर्ड से कक्षा 10वीं (हाईस्कूल) परीक्षा उत्तीर्ण होना अनिवार्य है।
              </p>
              <p>
                <strong>आयु सीमा (Age Limit as on 01/01/2027):</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                <li>न्यूनतम आयु: 18 वर्ष</li>
                <li>अधिकतम आयु: 23 वर्ष</li>
                <li>नियमानुसार ओबीसी को 3 वर्ष तथा एससी/एसटी को 5 वर्ष की अधिकतम आयु में छूट।</li>
              </ul>
            </div>
          </div>

          {/* Physical Standards */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accentBlue" />
              <span>शारीरिक मानक (PST / PET Standards)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300 divide-y divide-gray-800">
                <thead>
                  <tr className="text-gray-400 bg-navy/60">
                    <th className="p-2.5 font-semibold">मानक (Standard)</th>
                    <th className="p-2.5 font-semibold">पुरुष (Male)</th>
                    <th className="p-2.5 font-semibold">महिला (Female)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="p-2.5 font-medium text-white">ऊंचाई (Height) - Gen/OBC/SC</td>
                    <td className="p-2.5">170 सेमी</td>
                    <td className="p-2.5">157 सेमी</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">ऊंचाई (Height) - ST</td>
                    <td className="p-2.5">162.5 सेमी</td>
                    <td className="p-2.5">150 सेमी</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">सीना (Chest) - Gen/OBC/SC</td>
                    <td className="p-2.5">80-85 सेमी (5 सेमी फुलाव)</td>
                    <td className="p-2.5">लागू नहीं (NA)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">दौड़ (Running)</td>
                    <td className="p-2.5 text-accentGreen font-semibold">5 किमी - 24 मिनट में</td>
                    <td className="p-2.5 text-accentGreen font-semibold">1.6 किमी - 8.5 मिनट में</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Apply steps */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-white text-base">आवेदन कैसे करें (Step-by-step Process)</h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-300 leading-relaxed">
              <li>आधिकारिक वेबसाइट <strong>ssc.gov.in</strong> पर जाएं और नया OTR (One Time Registration) करें।</li>
              <li>रजिस्ट्रेशन नंबर व पासवर्ड से लॉगिन करके Apply लिंक पर क्लिक करें।</li>
              <li>लाइव वेबकैम से स्पष्ट फोटो लें एवं हस्ताक्षर (10-20 KB) अपलोड करें।</li>
              <li>अपनी श्रेणी अनुसार परीक्षा शुल्क का ऑनलाइन भुगतान करें।</li>
              <li>फाइनल सबमिट करने के बाद आवेदन पत्र का प्रिंटआउट सुरक्षित रखें।</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
