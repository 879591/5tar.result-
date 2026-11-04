"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, Calendar, CheckSquare, Clock, GraduationCap, 
  ArrowRight, Award, Sparkles, RefreshCw, Copy, Check 
} from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function StudentToolsPage() {
  const [activeTab, setActiveTab] = useState<"percentage" | "age" | "cgpa" | "eligibility" | "timetable">("percentage");

  // Percentage calculator state
  const [obtainedMarks, setObtainedMarks] = useState<number | "">("");
  const [totalMarks, setTotalMarks] = useState<number | "">("");
  const [percentageResult, setPercentageResult] = useState<number | null>(null);

  // Age calculator state
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState("2027-01-01");
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  // CGPA calculator state
  const [cgpa, setCgpa] = useState<number | "">("");
  const [cgpaResult, setCgpaResult] = useState<number | null>(null);

  // Eligibility checker state
  const [userAge, setUserAge] = useState<number | "">(21);
  const [userQual, setUserQual] = useState("12th");
  const [userCategory, setUserCategory] = useState("OBC");
  const [eligibleExams, setEligibleExams] = useState<string[]>([]);

  // Timetable generator state
  const [targetExam, setTargetExam] = useState("SSC GD");
  const [dailyHours, setDailyHours] = useState(6);
  const [generatedSchedule, setGeneratedSchedule] = useState<Array<{ time: string; subject: string; note: string }>>([]);
  const [copied, setCopied] = useState(false);

  // Calculate Percentage
  const handleCalcPercentage = (e: React.FormEvent) => {
    e.preventDefault();
    if (obtainedMarks !== "" && totalMarks !== "" && Number(totalMarks) > 0) {
      const p = (Number(obtainedMarks) / Number(totalMarks)) * 100;
      setPercentageResult(parseFloat(p.toFixed(2)));
    }
  };

  // Calculate Age
  const handleCalcAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !targetDate) return;

    const bDate = new Date(birthDate);
    const tDate = new Date(targetDate);

    if (tDate < bDate) {
      alert("कट-ऑफ तिथि जन्म तिथि के बाद की होनी चाहिए!");
      return;
    }

    let years = tDate.getFullYear() - bDate.getFullYear();
    let months = tDate.getMonth() - bDate.getMonth();
    let days = tDate.getDate() - bDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAgeResult({ years, months, days });
  };

  // Calculate CGPA
  const handleCalcCgpa = (e: React.FormEvent) => {
    e.preventDefault();
    if (cgpa !== "") {
      const p = Number(cgpa) * 9.5;
      setCgpaResult(parseFloat(p.toFixed(2)));
    }
  };

  // Check Eligibility
  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const age = Number(userAge);
    const results: string[] = [];

    // SSC GD: 10th pass, 18-23 (OBC: 18-26, SC/ST: 18-28)
    const maxAgeSsc = userCategory === "SC" || userCategory === "ST" ? 28 : userCategory === "OBC" ? 26 : 23;
    if (age >= 18 && age <= maxAgeSsc) {
      results.push("SSC GD Constable (10वीं पास)");
    }

    // UP Police Constable: 12th pass, 18-25 (OBC/SC/ST: 18-30)
    const maxAgePolice = userCategory !== "General" ? 30 : 25;
    if (age >= 18 && age <= maxAgePolice && ["12th", "Graduation", "Post Graduation"].includes(userQual)) {
      results.push("UP Police Constable / Fireman (12वीं पास)");
    }

    // Railway Group D & Technician: 10th / ITI, 18-33 (OBC: 36, SC/ST: 38)
    const maxAgeRrb = userCategory === "SC" || userCategory === "ST" ? 38 : userCategory === "OBC" ? 36 : 33;
    if (age >= 18 && age <= maxAgeRrb) {
      results.push("Railway RRB Group D & ALP Technician (10th/ITI/Diploma)");
    }

    // SSC CGL / BPSC: Graduate, 20-30 or 20-37
    if (age >= 20 && age <= 37 && ["Graduation", "Post Graduation"].includes(userQual)) {
      results.push("SSC CGL / State PSC / Bank PO (स्नातक स्तर)");
    }

    // CTET: 12th/D.El.Ed or Graduation/B.Ed
    if (age >= 18 && ["12th", "Graduation", "Post Graduation"].includes(userQual)) {
      results.push("CTET / State TET (शिक्षक पात्रता परीक्षा)");
    }

    setEligibleExams(results);
  };

  // Generate Timetable
  const handleGenerateTimetable = () => {
    let slots: Array<{ time: string; subject: string; note: string }> = [];
    if (dailyHours <= 4) {
      slots = [
        { time: "06:00 AM - 07:30 AM", subject: "कठिन विषय (Maths / Reasoning)", note: "ताज़ा दिमाग से 20 सवाल हल करें" },
        { time: "07:30 PM - 09:00 PM", subject: "सामान्य ज्ञान (GK & Current Affairs)", note: "दैनिक समसामयिकी और रिवीजन" },
        { time: "09:30 PM - 10:30 PM", subject: "मॉक टेस्ट / प्रैक्टिस सेट", note: "1 छोटा टेस्ट देकर गलतियां सुधारें" },
      ];
    } else if (dailyHours <= 6) {
      slots = [
        { time: "06:00 AM - 08:00 AM", subject: "गणित (Quantitative Aptitude)", note: "बेसिक कॉन्सेप्ट + 30 प्रश्न" },
        { time: "09:00 AM - 10:30 AM", subject: "तर्कशक्ति (Reasoning Ability)", note: "पज़ल, कोडिंग-डिकोडिंग, सीरीज़" },
        { time: "04:00 PM - 06:00 PM", subject: "सामान्य ज्ञान व सामान्य विज्ञान", note: "NCERT वन-लाइनर्स और इतिहास/भूगोल" },
        { time: "08:00 PM - 09:30 PM", subject: "भाषा (हिंदी / English Grammar)", note: "शब्दावली, वर्तनी एवं व्याकरण" },
        { time: "10:00 PM - 11:00 PM", subject: "मॉक टेस्ट व सेल्फ एनालिसिस", note: "5tarResult का डेली टेस्ट दें" },
      ];
    } else {
      slots = [
        { time: "05:30 AM - 07:30 AM", subject: "करेंट अफेयर्स व सामान्य ज्ञान", note: "पिछले 6 महीने की घटनाएं" },
        { time: "08:30 AM - 11:00 AM", subject: "गणित (Maths - Deep Practice)", note: "कठिन चैप्टर्स के शॉर्टकट फॉर्मूले" },
        { time: "01:30 PM - 03:30 PM", subject: "तर्कशक्ति (Reasoning Mastery)", note: "स्पीड और एक्यूरेसी पर काम करें" },
        { time: "05:00 PM - 07:00 PM", subject: "हिंदी व्याकरण / अंग्रेजी", note: "विलोम, पर्यायवाची, गद्यांश" },
        { time: "08:30 PM - 10:30 PM", subject: "फुल लेंथ मॉक टेस्ट (Full Mock)", note: "नेगेटिव मार्किंग के साथ पूरा टेस्ट" },
        { time: "10:30 PM - 11:00 PM", subject: "डेली रिवीजन व कल का प्लान", note: "कमजोर पॉइंट्स नोट करें" },
      ];
    }
    setGeneratedSchedule(slots);
  };

  const copySchedule = () => {
    const text = generatedSchedule.map((s) => `${s.time}: ${s.subject} (${s.note})`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 fill-gold" />
          <span>छात्र उपयोगी टूल्स (Free Student Utility Tools)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          विद्यार्थी सहायता कैलकुलेटर व टूल्स
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          बोर्ड परीक्षा प्रतिशत, सरकारी नौकरी आयु सीमा जांच, सीजीपीए कन्वर्टर और पढ़ाई का टाइम टेबल बनाएं
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {[
          { id: "percentage", name: "प्रतिशत कैलकुलेटर", icon: Calculator },
          { id: "age", name: "उम्र कैलकुलेटर (Age)", icon: Calendar },
          { id: "cgpa", name: "CGPA to % कन्वर्टर", icon: GraduationCap },
          { id: "eligibility", name: "परीक्षा पात्रता जांच", icon: CheckSquare },
          { id: "timetable", name: "टाइम टेबल जनरेटर", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                isActive
                  ? "bg-gold text-navy shadow-lg shadow-gold/20"
                  : "bg-navyLight text-gray-300 hover:text-white border border-gray-700/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERCENTAGE CALCULATOR */}
      {activeTab === "percentage" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-6 shadow-xl">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gold" />
              <span>प्राप्तांक प्रतिशत कैलकुलेटर (Percentage Calculator)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              अपने प्राप्त अंक और कुल पूर्णांक दर्ज करके तुरंत प्रतिशत जानें
            </p>
          </div>

          <form onSubmit={handleCalcPercentage} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                प्राप्तांक (Marks Obtained)
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="उदा. 425"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                कुल पूर्णांक (Total Maximum Marks)
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="उदा. 500"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-sm transition shadow-lg shadow-gold/20"
            >
              प्रतिशत निकालें (Calculate Percentage)
            </button>
          </form>

          {percentageResult !== null && (
            <div className="bg-navy p-5 rounded-2xl border border-gold/40 text-center space-y-2 animate-fadeIn">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">आपका प्रतिशत है</span>
              <div className="text-4xl font-black text-gold">{percentageResult}%</div>
              <div className="text-xs text-accentGreen font-semibold">
                {percentageResult >= 60 ? "★ प्रथम श्रेणी (1st Division / First Class)" : percentageResult >= 45 ? "द्वितीय श्रेणी (2nd Division)" : "तृतीय श्रेणी (3rd Division)"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AGE CALCULATOR */}
      {activeTab === "age" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-6 shadow-xl">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span>सरकारी नौकरी आयु सीमा कैलकुलेटर (Exact Age Calculator)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              सरकारी फॉर्म में मांगी गई कट-ऑफ तिथि के अनुसार अपनी सटीक आयु (वर्ष, माह, दिन) जानें
            </p>
          </div>

          <form onSubmit={handleCalcAge} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                आपकी जन्म तिथि (Date of Birth)
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                कट-ऑफ तिथि (Age as on Date - परीक्षा की गणना तिथि)
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-sm transition shadow-lg shadow-gold/20"
            >
              उम्र की गणना करें (Calculate Exact Age)
            </button>
          </form>

          {ageResult && (
            <div className="bg-navy p-5 rounded-2xl border border-gold/40 text-center space-y-3 animate-fadeIn">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">
                {targetDate} को आपकी आयु:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-navyLight p-3 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-gold">{ageResult.years}</div>
                  <div className="text-[10px] text-gray-400">वर्ष (Years)</div>
                </div>
                <div className="bg-navyLight p-3 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-accentGreen">{ageResult.months}</div>
                  <div className="text-[10px] text-gray-400">माह (Months)</div>
                </div>
                <div className="bg-navyLight p-3 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">{ageResult.days}</div>
                  <div className="text-[10px] text-gray-400">दिन (Days)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CGPA TO PERCENTAGE */}
      {activeTab === "cgpa" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-6 shadow-xl">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gold" />
              <span>CBSE / University CGPA to Percentage Calculator</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              मानक सीबीएसई फॉर्मूला: Percentage = CGPA × 9.5
            </p>
          </div>

          <form onSubmit={handleCalcCgpa} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                अपना सीजीपीए दर्ज करें (CGPA out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={10}
                required
                placeholder="उदा. 8.4"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-sm transition"
            >
              प्रतिशत में बदलें (Convert to %)
            </button>
          </form>

          {cgpaResult !== null && (
            <div className="bg-navy p-5 rounded-2xl border border-gold/40 text-center space-y-2 animate-fadeIn">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">समतुल्य प्रतिशत</span>
              <div className="text-4xl font-black text-gold">{cgpaResult}%</div>
              <p className="text-xs text-gray-400">गणना: {cgpa} × 9.5 = {cgpaResult}%</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EXAM ELIGIBILITY CHECKER */}
      {activeTab === "eligibility" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-xl">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gold" />
              <span>परीक्षा पात्रता जांच (Exam Eligibility Checker)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              अपनी वर्तमान आयु, योग्यता व श्रेणी चुनकर देखें आप किन-किन सरकारी परीक्षाओं के योग्य हैं
            </p>
          </div>

          <form onSubmit={handleCheckEligibility} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">आपकी आयु (Age)</label>
                <input
                  type="number"
                  min={14}
                  max={50}
                  required
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">शैक्षणिक योग्यता</label>
                <select
                  value={userQual}
                  onChange={(e) => setUserQual(e.target.value)}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="ITI">ITI / Diploma</option>
                  <option value="Graduation">Graduation (BA/BSc/BCom/BTech)</option>
                  <option value="Post Graduation">Post Graduation (MA/MSc)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">आरक्षण श्रेणी (Category)</label>
                <select
                  value={userCategory}
                  onChange={(e) => setUserCategory(e.target.value)}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="General">General / EWS</option>
                  <option value="OBC">OBC (+3 वर्ष छूट)</option>
                  <option value="SC">SC (+5 वर्ष छूट)</option>
                  <option value="ST">ST (+5 वर्ष छूट)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-sm transition shadow-md"
            >
              पात्र परीक्षाएं खोजें (Check My Eligible Exams)
            </button>
          </form>

          {eligibleExams.length > 0 && (
            <div className="bg-navy p-5 rounded-2xl border border-accentGreen/40 space-y-3 animate-fadeIn">
              <span className="text-xs font-bold text-accentGreen flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>आप निम्नलिखित {eligibleExams.length} परीक्षाओं के लिए पात्र हैं:</span>
              </span>
              <ul className="space-y-2 text-xs">
                {eligibleExams.map((ex, i) => (
                  <li key={i} className="flex items-center gap-2 text-white bg-navyLight/60 p-2.5 rounded-xl border border-gray-800">
                    <span className="text-gold font-bold">✔</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: STUDY TIMETABLE GENERATOR */}
      {activeTab === "timetable" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-xl">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              <span>स्मार्ट अध्ययन समय सारिणी (Study Timetable Generator)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              अपने दैनिक उपलब्ध समय के अनुसार वैज्ञानिक रूप से संतुलित अध्ययन रूटीन बनाएं
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">लक्ष्य परीक्षा (Target Exam)</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="SSC GD">SSC GD Constable</option>
                <option value="UP Police">UP Police Bharti</option>
                <option value="Railway">Railway RRB ALP / Group D</option>
                <option value="Navodaya">JNVST Navodaya Class 6/9</option>
                <option value="Board Exam">Class 10th / 12th Board</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">दैनिक पढ़ाई के घंटे (Daily Hours)</label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value={4}>4 घंटे / दिन (पार्ट-टाइम / शुरुआती)</option>
                <option value={6}>6 घंटे / दिन (संतुलित तैयारी - Recommended)</option>
                <option value={8}>8+ घंटे / दिन (फुल टाइम डेडिकेटेड तैयारी)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateTimetable}
            className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy font-bold rounded-xl text-sm transition shadow-md"
          >
            टाइम टेबल जनरेट करें (Generate Daily Schedule)
          </button>

          {generatedSchedule.length > 0 && (
            <div className="bg-navy p-5 rounded-2xl border border-gray-700 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-xs font-bold text-gold">
                  {targetExam} के लिए {dailyHours} घंटे का दैनिक प्लान:
                </span>
                <button
                  onClick={copySchedule}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 p-1 bg-navyLight rounded-lg border border-gray-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accentGreen" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "कॉपी हो गया!" : "कॉपी करें"}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {generatedSchedule.map((slot, idx) => (
                  <div key={idx} className="bg-navyLight p-3 rounded-xl border border-gray-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-mono text-gold font-semibold shrink-0">{slot.time}</span>
                    <span className="font-bold text-white">{slot.subject}</span>
                    <span className="text-gray-400 text-[11px]">{slot.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ad Placement */}
      <AdBanner slot="tools-bottom" format="horizontal" />
    </div>
  );
}
