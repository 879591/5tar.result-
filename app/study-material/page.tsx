"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Download, FileText, CheckCircle2, Bookmark, Sparkles, GraduationCap } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const STUDY_MATERIALS = [
  {
    id: "sm-geo",
    title: "भारत एवं विश्व का भूगोल (Geography) - NCERT सार संग्रह",
    subject: "भूगोल (Geography) - भौतिक, आर्थिक व मानव भूगोल",
    fileSize: "18.4 MB",
    pages: "220 Pages",
    downloads: "64.2K",
    category: "Geography",
    level: "College & Competition",
    medium: "हिंदी माध्यम",
  },
  {
    id: "sm-eco",
    title: "भारतीय अर्थव्यवस्था (Economics) - बजट, बैंकिंग एवं योजनाएं",
    subject: "अर्थशास्त्र (Economics) - सूक्ष्म व समष्टि अर्थशास्त्र",
    fileSize: "14.1 MB",
    pages: "175 Pages",
    downloads: "48.5K",
    category: "Economics",
    level: "BA / BCom & UPSC/SSC",
    medium: "हिंदी माध्यम",
  },
  {
    id: "sm-san",
    title: "संस्कृत व्याकरण एवं साहित्य (Sanskrit) - संधि, समास, धातु रूप",
    subject: "संस्कृत (Sanskrit) - संपूर्ण व्याकरण एवं अनुवाद नियम",
    fileSize: "9.2 MB",
    pages: "115 Pages",
    downloads: "32.0K",
    category: "Sanskrit",
    level: "Class 10/12 & CTET/TGT",
    medium: "हिंदी माध्यम",
  },
  {
    id: "sm-c10",
    title: "Class 10th Board Exam - गणित, विज्ञान एवं सामाजिक विज्ञान कैप्सूल",
    subject: "कक्षा 10वीं बोर्ड परीक्षा नोट्स (NCERT Based)",
    fileSize: "22.5 MB",
    pages: "240 Pages",
    downloads: "88.9K",
    category: "Class 10",
    level: "Class 10th",
    medium: "हिंदी / English",
  },
  {
    id: "sm-c12",
    title: "Class 12th Board Exam - भौतिकी, रसायन, जीव विज्ञान व हिंदी",
    subject: "कक्षा 12वीं बोर्ड परीक्षा टॉपर्स हस्तलिखित नोट्स",
    fileSize: "28.0 MB",
    pages: "310 Pages",
    downloads: "74.1K",
    category: "Class 12",
    level: "Class 12th",
    medium: "हिंदी माध्यम",
  },
  {
    id: "sm-ba",
    title: "B.A. (Bachelor of Arts) - इतिहास, राजनीति विज्ञान व समाजशास्त्र",
    subject: "बीए प्रथम, द्वितीय एवं तृतीय वर्ष संपूर्ण अध्ययन नोट्स",
    fileSize: "32.6 MB",
    pages: "360 Pages",
    downloads: "41.3K",
    category: "BA/BSc/BCom",
    level: "College Degree",
    medium: "हिंदी माध्यम",
  },
  {
    id: "sm-bcom",
    title: "B.Com / B.Sc - फाइनेंशियल अकाउंटिंग, स्टेटिस्टिक्स एवं केमिस्ट्री",
    subject: "बीकॉम व बीएससी महत्वपूर्ण प्रश्न बैंक एवं हल सहित नोट्स",
    fileSize: "26.4 MB",
    pages: "290 Pages",
    downloads: "35.8K",
    category: "BA/BSc/BCom",
    level: "College Degree",
    medium: "English & Hindi",
  },
  {
    id: "sm-ssc",
    title: "SSC GD & CGL Constable Complete 5-Year Solved Papers (PYQs)",
    subject: "कर्मचारी चयन आयोग रीजनिंग, मैथ्स एवं जीके प्रैक्टिस सेट",
    fileSize: "16.5 MB",
    pages: "195 Pages",
    downloads: "95.6K",
    category: "Competition",
    level: "Sarkari Exams",
    medium: "द्विभाषी (Bilingual)",
  },
  {
    id: "sm-jnv",
    title: "JNVST Navodaya Class 6 Mental Ability 500 Tricks & Formula Sheet",
    subject: "जवाहर नवोदय विद्यालय कक्षा 6 मानसिक योग्यता गाइड",
    fileSize: "8.5 MB",
    pages: "96 Pages",
    downloads: "52.4K",
    category: "Competition",
    level: "Navodaya Entrance",
    medium: "हिंदी माध्यम",
  },
];

export default function StudyMaterialPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered = STUDY_MATERIALS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "all" || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <span className="text-white">Study Material</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-gold" />
            <span>अध्ययन सामग्री एवं पीडीएफ पुस्तकालय (Study Materials)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            कक्षा 10, 12, बीए, बीएससी, बीकॉम, भूगोल, अर्थशास्त्र, संस्कृत एवं प्रतियोगी परीक्षा नोट्स
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="खोजें: भूगोल, अर्थशास्त्र, संस्कृत, Class 10, BA, SSC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navyLight border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold shadow"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", name: "सभी अध्ययन सामग्री" },
            { id: "Geography", name: "भूगोल (Geography)" },
            { id: "Economics", name: "अर्थशास्त्र (Economics)" },
            { id: "Sanskrit", name: "संस्कृत (Sanskrit)" },
            { id: "Class 10", name: "Class 10th" },
            { id: "Class 12", name: "Class 12th" },
            { id: "BA/BSc/BCom", name: "कॉलेज (BA/BSc/BCom)" },
            { id: "Competition", name: "सरकारी नौकरी (Competitive)" },
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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-navyLight border border-gray-800 hover:border-gold/40 rounded-2xl p-5 transition flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-gold/15 text-gold border border-gold/30">
                  {item.medium}
                </span>
                <span className="text-[10px] text-gray-400 bg-navy px-2 py-0.5 rounded border border-gray-800 font-mono">
                  {item.downloads} डाउनलोड्स
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-gold transition line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">{item.subject}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 bg-navy/60 p-2.5 rounded-xl border border-gray-800">
                <span>साइज: {item.fileSize}</span>
                <span>•</span>
                <span>{item.pages}</span>
                <span>•</span>
                <span className="text-accentGreen font-semibold">{item.level}</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-accentGreen font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>निःशुल्क पीडीएफ</span>
              </span>
              <button
                onClick={() => {
                  alert(`डाउनलोड लिंक तैयार हो रहा है: ${item.title}`);
                }}
                className="px-4 py-2 bg-gold hover:bg-yellow-400 text-navy font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF डाउनलोड</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdBanner slot="study-mid" format="horizontal" />
    </div>
  );
}
