"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, PlusCircle, FileText, Briefcase, CheckCircle2, 
  GraduationCap, Bell, Bot, Sparkles, Trash2, Edit3, 
  Eye, Share2, Copy, Check, AlertTriangle, ArrowRight, Lock 
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "jobs" | "results" | "exams" | "study" | "mock" | "automation" | "announcements"
  >("overview");

  // Sample managed jobs
  const [jobs, setJobs] = useState([
    { id: "job-1", title: "SSC GD Constable 2026", vacancies: "45,284", lastDate: "2026-11-30", status: "Published" },
    { id: "job-2", title: "UP Police SI Direct Bharti 2026", vacancies: "12,500", lastDate: "2026-12-15", status: "Published" },
    { id: "job-3", title: "Railway RRB ALP Vacancy", vacancies: "18,799", lastDate: "2026-10-15", status: "Expired" },
  ]);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    qualification: "10th",
    vacancies: "",
    lastDate: "",
    state: "Central",
    applyLink: "",
    pdfLink: "",
  });

  // New MCQ Question State
  const [newQuestion, setNewQuestion] = useState({
    testTitle: "SSC GD Live Mock 01",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: "",
  });

  // Announcements Ticker State
  const [announcements, setAnnouncements] = useState([
    "UP Police Constable Exam 2026 Revised Answer Key जारी",
    "Navodaya Vidyalaya JNVST Class 6 Admission 2026-27 प्रवेश पत्र डाउनलोड करें",
    "SSC GD Constable 2026 Online Form: कुल 45,000+ पद आमंत्रित",
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // Automation / Assistant State
  const [jobRawInput, setJobRawInput] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [socialShareText, setSocialShareText] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  // Authenticate Admin securely via server-side verification
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: adminPasscode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "अमान्य एडमिन पासकोड! (Invalid Passcode)");
      }
    } catch (err: any) {
      setAuthError("सर्वर से कनेक्ट करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setIsVerifying(false);
    }
  };

  // Add Job
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title) return;
    const item = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      vacancies: newJob.vacancies || "1,000+",
      lastDate: newJob.lastDate || "2026-12-31",
      status: "Published",
    };
    setJobs([item, ...jobs]);
    setNewJob({
      title: "",
      department: "",
      qualification: "10th",
      vacancies: "",
      lastDate: "",
      state: "Central",
      applyLink: "",
      pdfLink: "",
    });
    alert("नई सरकारी नौकरी सफलतापूर्वक प्रकाशित की गई!");
  };

  // Generate Automated Draft
  const handleGenerateDraft = () => {
    if (!jobRawInput.trim()) return;
    const title = jobRawInput.includes("UP Police")
      ? "UP Police Constable Recruitment 2026"
      : jobRawInput.includes("Railway")
      ? "Railway RRB Non-Technical 2026"
      : `${jobRawInput.slice(0, 35)} भर्ती 2026`;

    setGeneratedDraft({
      title: title,
      department: "संबंधित आयोग / भर्ती बोर्ड",
      qualification: "10th / 12th Pass",
      vacancies: "5,000+ संभावित पद",
      lastDate: "30 दिन का समय",
      seoTitle: `${title} - ऑनलाइन आवेदन फॉर्म, सिलेबस व पात्रता | 5tarResult`,
      seoMeta: `${title} के लिए ऑनलाइन आवेदन शुरू। कुल पद, आयु सीमा, परीक्षा तिथि एवं चयन प्रक्रिया की पूरी जानकारी 5tarResult पर देखें।`,
    });

    const share = `📢 *5tarResult नई भर्ती अलर्ट 2026* 🌟\n\n📌 *पद:* ${title}\n🎓 *योग्यता:* 10वीं / 12वीं पास\n📅 *अंतिम तिथि:* जल्द समाप्त होगी\n\n👉 *पूरी जानकारी व ऑनलाइन फॉर्म लिंक:* \nhttps://5tarresult.com/jobs\n\n_अपने दोस्तों के साथ WhatsApp व Telegram ग्रुप में शेयर करें!_`;
    setSocialShareText(share);
  };

  const copyShareText = () => {
    navigator.clipboard.writeText(socialShareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Detect Outdated Jobs
  const expiredJobs = jobs.filter((j) => new Date(j.lastDate) < new Date());

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-navyLight border border-gray-800 rounded-2xl max-w-sm w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
          <div className="w-14 h-14 bg-gold/15 text-gold border border-gold/40 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">5tarResult व्यवस्थापक पैनल (Admin)</h1>
            <p className="text-xs text-gray-400 mt-1">
              प्रकाशन एवं प्रबंधन हेतु एडमिन पासकोड दर्ज करें
            </p>
          </div>

          {authError && (
            <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-800 p-2.5 rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              required
              placeholder="सुरक्षित एडमिन पासकोड दर्ज करें..."
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              disabled={isVerifying}
              className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-center text-sm text-white focus:outline-none focus:border-gold font-mono"
            />
            <button
              type="submit"
              disabled={isVerifying || !adminPasscode.trim()}
              className="w-full py-3 bg-gold hover:bg-yellow-400 disabled:opacity-40 text-navy font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isVerifying ? "सत्यापित हो रहा है..." : "सुरक्षित एडमिन लॉगिन"}</span>
            </button>
          </form>
          <p className="text-[10px] text-gray-500">
            पासकोड सर्वर-साइड पर्यावरण चर (Environment Variable) द्वारा सुरक्षित है
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">5tarResult CMS & Admin Control</h1>
              <span className="text-[10px] bg-accentGreen/20 text-accentGreen border border-accentGreen/40 px-2 py-0.5 rounded-full font-bold">
                सुरक्षित एडमिन मोड
              </span>
            </div>
            <p className="text-xs text-gray-400">
              सामग्री प्रबंधन, प्रश्नोत्तरी निर्माण, एवं स्वचालित प्रकाशन सहायक
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-800/60 bg-rose-950/30 self-start sm:self-auto"
        >
          लॉगआउट (Logout)
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: "overview", name: "डैशबोर्ड सारांश", icon: Shield },
          { id: "jobs", name: "नौकरियां (Jobs)", icon: Briefcase },
          { id: "mock", name: "MCQ टेस्ट व प्रश्न", icon: CheckCircle2 },
          { id: "announcements", name: "ताज़ा अपडेट्स टिकर", icon: Bell },
          { id: "automation", name: "AI ऑटोमेशन ड्राफ्टर", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition ${
                isActive
                  ? "bg-gold text-navy font-bold shadow-md shadow-gold/20"
                  : "bg-navyLight text-gray-300 hover:text-white border border-gray-700/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl">
              <span className="text-[10px] text-gray-400 uppercase">कुल प्रकाशित नौकरियां</span>
              <div className="text-3xl font-black text-white mt-1">{jobs.length}</div>
            </div>
            <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl">
              <span className="text-[10px] text-gray-400 uppercase">सक्रिय टिकर अपडेट्स</span>
              <div className="text-3xl font-black text-gold mt-1">{announcements.length}</div>
            </div>
            <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl">
              <span className="text-[10px] text-gray-400 uppercase">समाप्त हो चुकी सूचनाएं</span>
              <div className="text-3xl font-black text-rose-400 mt-1">{expiredJobs.length}</div>
            </div>
            <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl">
              <span className="text-[10px] text-gray-400 uppercase">सिस्टम स्वास्थ्य</span>
              <div className="text-base font-bold text-accentGreen mt-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accentGreen animate-pulse" />
                <span>100% सामान्य (Online)</span>
              </div>
            </div>
          </div>

          {/* Outdated Content Detector */}
          {expiredJobs.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>अंतिम तिथि समाप्त सामग्री चेतावनी (Outdated Content Detector):</span>
              </div>
              <p className="text-xs text-gray-300">
                निम्नलिखित नौकरियों की अंतिम तिथि बीत चुकी है। कृपया उन्हें अपडेट करें या स्थिति &quot;समाप्त (Expired)&quot; करें:
              </p>
              <div className="space-y-2">
                {expiredJobs.map((j) => (
                  <div key={j.id} className="bg-navy p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{j.title}</span>
                    <span className="text-rose-400 text-[11px]">अंतिम तिथि: {j.lastDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JOBS MANAGEMENT */}
      {activeTab === "jobs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Job Form */}
          <div className="lg:col-span-1 bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-2 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>नई नौकरी प्रकाशित करें (Publish Job)</span>
            </h3>

            <form onSubmit={handleAddJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">शीर्षक (Job Title)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. SSC GD Constable 2026"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">विभाग / बोर्ड (Department)</label>
                <input
                  type="text"
                  placeholder="Staff Selection Commission"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">योग्यता (Qualification)</label>
                  <select
                    value={newJob.qualification}
                    onChange={(e) => setNewJob({ ...newJob, qualification: e.target.value })}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="8th">8th Pass</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="ITI">ITI / Diploma</option>
                    <option value="Graduation">Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">कुल पद (Vacancies)</label>
                  <input
                    type="text"
                    placeholder="45,000+"
                    value={newJob.vacancies}
                    onChange={(e) => setNewJob({ ...newJob, vacancies: e.target.value })}
                    className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">अंतिम तिथि (Last Date)</label>
                <input
                  type="date"
                  value={newJob.lastDate}
                  onChange={(e) => setNewJob({ ...newJob, lastDate: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">ऑनलाइन आवेदन लिंक (Apply URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newJob.applyLink}
                  onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gold hover:bg-yellow-400 text-navy font-bold rounded-xl transition shadow"
              >
                वेबसाइट पर लाइव करें
              </button>
            </form>
          </div>

          {/* Job List Table */}
          <div className="lg:col-span-2 bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-2">
              वर्तमान में प्रकाशित नौकरियां ({jobs.length})
            </h3>
            <div className="divide-y divide-gray-800 space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{job.title}</h4>
                    <span className="text-[10px] text-gray-400">
                      पद: {job.vacancies} | अंतिम तिथि: {job.lastDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        job.status === "Published"
                          ? "bg-accentGreen/20 text-accentGreen"
                          : "bg-rose-950 text-rose-400"
                      }`}
                    >
                      {job.status}
                    </span>
                    <button
                      onClick={() => setJobs(jobs.filter((j) => j.id !== job.id))}
                      className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-navy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MCQ QUESTION BUILDER */}
      {activeTab === "mock" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto shadow-xl">
          <h3 className="font-bold text-white text-base border-b border-gray-800 pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            <span>ऑनलाइन मॉक टेस्ट में नया प्रश्न जोड़ें (Add MCQ Question)</span>
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("नया प्रश्न मॉक टेस्ट में सुरक्षित हो गया!");
              setNewQuestion({
                testTitle: "SSC GD Live Mock 01",
                question: "",
                optionA: "",
                optionB: "",
                optionC: "",
                optionD: "",
                correctOption: "A",
                explanation: "",
              });
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block text-gray-300 mb-1">मॉक टेस्ट चुनें</label>
              <select
                value={newQuestion.testTitle}
                onChange={(e) => setNewQuestion({ ...newQuestion, testTitle: e.target.value })}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
              >
                <option value="SSC GD Live Mock 01">SSC GD Constable Live Mock 01</option>
                <option value="JNVST Navodaya Class 6">Navodaya Class 6 Mental Ability</option>
                <option value="UP Police Special">UP Police Hindi & GK Capsule</option>
                <option value="Railway Science">Railway General Science Test</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">प्रश्न का पाठ (Question Statement in Hindi/English)</label>
              <textarea
                required
                rows={2}
                placeholder="उदा. भारत के किस राज्य में काजीरंगा राष्ट्रीय उद्यान स्थित है?"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">विकल्प A (Option A)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. असम"
                  value={newQuestion.optionA}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">विकल्प B (Option B)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. पश्चिम बंगाल"
                  value={newQuestion.optionB}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">विकल्प C (Option C)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. उत्तराखंड"
                  value={newQuestion.optionC}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">विकल्प D (Option D)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राजस्थान"
                  value={newQuestion.optionD}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gold font-semibold mb-1">सही विकल्प (Correct Option)</label>
                <select
                  value={newQuestion.correctOption}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: e.target.value })}
                  className="w-full bg-navy border border-gold rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="A">विकल्प A</option>
                  <option value="B">विकल्प B</option>
                  <option value="C">विकल्प C</option>
                  <option value="D">विकल्प D</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">व्याख्या / हल (Explanation)</label>
                <input
                  type="text"
                  placeholder="उदा. काजीरंगा असम के गोलाघाट जिले में स्थित है।"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-accentGreen to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md mt-2"
            >
              प्रश्न टेस्ट में शामिल करें (Save Question)
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS TICKER */}
      {activeTab === "announcements" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto shadow-xl">
          <h3 className="font-bold text-white text-base border-b border-gray-800 pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold" />
            <span>होमपेज फ्लैश टिकर प्रबंधन (Announcement Bar Ticker)</span>
          </h3>

          <div className="flex gap-2 text-xs">
            <input
              type="text"
              placeholder="नया टिकर संदेश लिखें (उदा. CTET 2026 एडमिट कार्ड लाइव)..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="flex-1 bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => {
                if (newAnnouncement.trim()) {
                  setAnnouncements([newAnnouncement.trim(), ...announcements]);
                  setNewAnnouncement("");
                }
              }}
              className="px-4 py-2.5 bg-gold hover:bg-yellow-400 text-navy font-bold rounded-xl whitespace-nowrap"
            >
              जोड़ें
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {announcements.map((item, idx) => (
              <div key={idx} className="bg-navy p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-200">{item}</span>
                <button
                  onClick={() => setAnnouncements(announcements.filter((_, i) => i !== idx))}
                  className="text-gray-400 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI AUTOMATION DRAFTER */}
      {activeTab === "automation" && (
        <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-6 max-w-3xl mx-auto shadow-xl">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>एडमिन ऑटोमेशन एवं ड्राफ्ट असिस्टेंट (Automation Workflow)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              सरकारी विज्ञप्ति का नाम दर्ज करें — यह स्वचालित रूप से SEO शीर्षक, मेटा विवरण और सोशल मीडिया पोस्ट तैयार करेगा।
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-300">
              भर्ती का नाम या कच्ची सूचना (Raw Notification Name)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="उदा. UP Police SI 2026 या SSC GD 45000 पद"
                value={jobRawInput}
                onChange={(e) => setJobRawInput(e.target.value)}
                className="flex-1 bg-navy border border-gray-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleGenerateDraft}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow"
              >
                <Bot className="w-4 h-4" />
                <span>ड्राफ्ट बनाएं</span>
              </button>
            </div>
          </div>

          {generatedDraft && (
            <div className="space-y-4 pt-3 border-t border-gray-800 text-xs">
              <div className="bg-navy p-4 rounded-xl border border-purple-500/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 block">
                  ऑटोमेटेड SEO मेटाडेटा
                </span>
                <div>
                  <span className="text-gray-400 block text-[10px]">SEO Title:</span>
                  <span className="font-bold text-white">{generatedDraft.seoTitle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Meta Description:</span>
                  <span className="text-gray-300">{generatedDraft.seoMeta}</span>
                </div>
              </div>

              {socialShareText && (
                <div className="bg-navy p-4 rounded-xl border border-accentGreen/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-accentGreen flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp / Telegram शेयरिंग टेक्स्ट</span>
                    </span>
                    <button
                      onClick={copyShareText}
                      className="text-xs bg-navyLight border border-gray-700 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
                    >
                      {copiedShare ? <Check className="w-3.5 h-3.5 text-accentGreen" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedShare ? "कॉपी हो गया!" : "कॉपी करें"}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-gray-300 font-sans whitespace-pre-wrap leading-relaxed bg-navyLight/70 p-3 rounded-lg border border-gray-800">
                    {socialShareText}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
