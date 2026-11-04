"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, Clock, Award, CheckCircle, ArrowRight, 
  HelpCircle, Sparkles, Filter, ChevronRight 
} from "lucide-react";
import AdBanner from "@/components/AdBanner";

const MOCK_SERIES = [
  {
    id: "mock-1",
    title: "SSC GD Constable 2026 - All India Live Mock Test 01",
    category: "SSC",
    questions: 80,
    timeMinutes: 60,
    marks: 160,
    negativeMarks: "0.25 Marks",
    language: "हिंदी / English",
    attempts: "18,420",
    description: "रीजनिंग (20), सामान्य ज्ञान (20), प्रारंभिक गणित (20) एवं हिंदी/अंग्रेजी (20)। पूर्णतः नवीनतम पाठ्यक्रम पर आधारित।",
  },
  {
    id: "mock-2",
    title: "JNVST Navodaya Vidyalaya Class 6 Selection Exam Paper",
    category: "Navodaya",
    questions: 50,
    timeMinutes: 60,
    marks: 100,
    negativeMarks: "कोई नहीं (No Negative)",
    language: "हिंदी / English",
    attempts: "12,950",
    description: "मानसिक योग्यता (Mental Ability Test) एवं अंकगणित परीक्षण के अति-महत्वपूर्ण प्रश्न।",
  },
  {
    id: "mock-3",
    title: "UP Police Constable GK, Hindi & Reasoning Mega Test",
    category: "Police",
    questions: 50,
    timeMinutes: 45,
    marks: 100,
    negativeMarks: "0.50 Marks",
    language: "हिंदी",
    attempts: "24,800",
    description: "उत्तर प्रदेश सामान्य ज्ञान, भारतीय संविधान, हिंदी व्याकरण एवं तर्कशक्ति।",
  },
  {
    id: "mock-4",
    title: "Railway RRB General Science & Current Affairs Speed Test",
    category: "Railway",
    questions: 40,
    timeMinutes: 30,
    marks: 40,
    negativeMarks: "1/3rd Marks",
    language: "हिंदी / English",
    attempts: "15,100",
    description: "NCERT आधारित भौतिक, रसायन, जीव विज्ञान एवं 2026 के महत्वपूर्ण समसामयिकी प्रश्न।",
  },
  {
    id: "mock-5",
    title: "UPSC Civil Services Prelims GS Paper-1 Practice Test",
    category: "UPSC",
    questions: 50,
    timeMinutes: 60,
    marks: 100,
    negativeMarks: "0.66 Marks",
    language: "हिंदी / English",
    attempts: "8,920",
    description: "भारतीय राजव्यवस्था, इतिहास, पर्यावरण, अर्थव्यवस्था और आधुनिक भारत।",
  },
  {
    id: "mock-6",
    title: "SBI & IBPS Clerk / PO Quantitative & Reasoning Test",
    category: "Banking",
    questions: 35,
    timeMinutes: 20,
    marks: 35,
    negativeMarks: "0.25 Marks",
    language: "English / Hindi",
    attempts: "11,350",
    description: "सिम्प्लीफिकेशन, डीआई (Data Interpretation), नंबर सीरीज़ व पज़ल।",
  },
  {
    id: "mock-7",
    title: "CTET December 2026 बाल विकास एवं शिक्षाशास्त्र (CDP) स्पेशल",
    category: "CTET",
    questions: 30,
    timeMinutes: 30,
    marks: 30,
    negativeMarks: "कोई नहीं",
    language: "हिंदी / English",
    attempts: "16,700",
    description: "जीन पियाजे, कोहलबर्ग, वाइगोत्स्की, समावेशी शिक्षा एवं शिक्षण विधियां।",
  },
  {
    id: "mock-8",
    title: "Class 10th & 12th Board Exam Objective 50 Model Paper",
    category: "Board",
    questions: 50,
    timeMinutes: 45,
    marks: 50,
    negativeMarks: "कोई नहीं",
    language: "हिंदी माध्यम",
    attempts: "20,400",
    description: "बोर्ड परीक्षा में 100% स्कोर करने हेतु बहुविकल्पीय वस्तुनिष्ठ प्रश्न।",
  },
];

export default function MockTestsPage() {
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered = MOCK_SERIES.filter(
    (test) => selectedCat === "all" || test.category === selectedCat
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <span className="text-white">Mock Tests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-gold" />
            <span>फ्री ऑनलाइन मॉक टेस्ट श्रृंखला (All India Mock Tests)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            SSC, Railway, Police, UPSC, Banking, CTET, Navodaya व बोर्ड परीक्षाओं के वास्तविक ऑनलाइन टेस्ट
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "all", name: "सभी मॉक टेस्ट" },
          { id: "SSC", name: "SSC" },
          { id: "Railway", name: "Railway" },
          { id: "Police", name: "Police" },
          { id: "UPSC", name: "UPSC" },
          { id: "Banking", name: "Banking" },
          { id: "CTET", name: "CTET / TET" },
          { id: "Navodaya", name: "JNVST Navodaya" },
          { id: "Board", name: "Board 10th/12th" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCat === cat.id
                ? "bg-gold text-navy shadow-md shadow-gold/20"
                : "bg-navyLight text-gray-300 hover:text-white border border-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((test) => (
          <div
            key={test.id}
            className="bg-navyLight border border-gray-800 hover:border-gold/40 rounded-2xl p-6 transition flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-accentGreen/15 text-accentGreen border border-accentGreen/30">
                  {test.category} फ्री टेस्ट
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {test.attempts} विद्यार्थियों ने दिया
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-gold transition">
                {test.title}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                {test.description}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-navy/70 p-3 rounded-xl border border-gray-800 text-center">
                <div>
                  <span className="text-[10px] text-gray-500 block">कुल प्रश्न:</span>
                  <span className="font-bold text-white text-xs">{test.questions} Qs</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">समय सीमा:</span>
                  <span className="font-bold text-gold text-xs">{test.timeMinutes} मिनट</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">अंक (Marks):</span>
                  <span className="font-bold text-accentGreen text-xs">{test.marks} Marks</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">नेगेटिव मार्किंग: {test.negativeMarks}</span>
              <Link
                href={`/mock-tests/${test.id}`}
                className="px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold text-xs rounded-xl transition shadow-md shadow-gold/20 flex items-center gap-1.5"
              >
                <span>टेस्ट शुरू करें (Start Test)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <AdBanner slot="mock-tests-bottom" format="horizontal" />
    </div>
  );
}
