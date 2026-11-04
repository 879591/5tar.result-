"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, 
  ArrowRight, Award, RotateCcw, HelpCircle, Check, ShieldCheck 
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "भारतीय संविधान के किस अनुच्छेद के तहत अस्पृश्यता (Untouchability) का उन्मूलन किया गया है?",
    options: ["अनुच्छेद 14", "अनुच्छेद 17", "अनुच्छेद 19", "अनुच्छेद 21"],
    correctIndex: 1,
    explanation: "भारतीय संविधान के अनुच्छेद 17 (Article 17) के तहत अस्पृश्यता का अंत किया गया है और इसका किसी भी रूप में आचरण निषिद्ध है।",
  },
  {
    id: 2,
    question: "यदि किसी संख्या का 20%, 120 के बराबर है, तो उस संख्या का 120% कितना होगा?",
    options: ["720", "360", "480", "600"],
    correctIndex: 0,
    explanation: "संख्या x = (120 × 100) / 20 = 600। अतः 600 का 120% = (600 × 120) / 100 = 720।",
  },
  {
    id: 3,
    question: "निम्न में से कौन सी नदी 'दक्षिण भारत की गंगा' (Ganga of South) के नाम से जानी जाती है?",
    options: ["कृष्णा", "महानदी", "कावेरी", "गोदावरी"],
    correctIndex: 3,
    explanation: "गोदावरी को उसकी विशालता और पवित्रता के कारण दक्षिण गंगा या वृद्ध गंगा कहा जाता है।",
  },
  {
    id: 4,
    question: "दिए गए विकल्पों में से संबंधित शब्द चुनिए: पुस्तक : पृष्ठ :: दीवार : ?",
    options: ["रेत", "सीमेंट", "ईंट", "छत"],
    correctIndex: 2,
    explanation: "जिस प्रकार पृष्ठों से मिलकर पुस्तक बनती है, उसी प्रकार ईंटों से मिलकर दीवार बनती है।",
  },
  {
    id: 5,
    question: "जवाहर नवोदय विद्यालय (JNV) की स्थापना किस राष्ट्रीय शिक्षा नीति के तहत की गई थी?",
    options: ["राष्ट्रीय शिक्षा नीति 1968", "राष्ट्रीय शिक्षा नीति 1986", "राष्ट्रीय शिक्षा नीति 2020", "मुदालियर आयोग"],
    correctIndex: 1,
    explanation: "जवाहर नवोदय विद्यालयों की स्थापना राजीव गांधी सरकार के समय राष्ट्रीय शिक्षा नीति 1986 के अंतर्गत ग्रामीण प्रतिभाओं को निखारने हेतु की गई थी।",
  },
];

export default function MockTestPlayerPage() {
  const params = useParams();
  const testId = params?.id as string;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleClearResponse = () => {
    if (isSubmitted) return;
    const updated = { ...selectedAnswers };
    delete updated[currentIndex];
    setSelectedAnswers(updated);
  };

  // Score calculation
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  SAMPLE_QUESTIONS.forEach((q, idx) => {
    if (selectedAnswers[idx] === undefined) {
      unattemptedCount++;
    } else if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalScore = correctCount * 2 - wrongCount * 0.5;
  const currentQ = SAMPLE_QUESTIONS[currentIndex];

  const handleRestart = () => {
    setSelectedAnswers({});
    setTimeLeft(15 * 60);
    setIsSubmitted(false);
    setCurrentIndex(0);
    setShowConfirmSubmit(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Test Header */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/mock-tests"
            className="p-2 rounded-xl bg-navy border border-gray-700 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white">
              5tarResult ऑनलाइन अभ्यास टेस्ट (Live Test 01)
            </h1>
            <span className="text-xs text-gray-400">
              प्रत्येक सही उत्तर: +2 अंक | गलत उत्तर: -0.50 अंक
            </span>
          </div>
        </div>

        {/* Live Timer or Score Badge */}
        {!isSubmitted ? (
          <div className="flex items-center gap-2 bg-navy px-4 py-2 rounded-xl border border-gold/40 text-gold font-mono font-bold text-sm sm:text-base">
            <Clock className="w-4 h-4 animate-spin text-gold" />
            <span>शेष समय: {formatTime(timeLeft)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-accentGreen/20 px-4 py-2 rounded-xl border border-accentGreen/40 text-accentGreen font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>टेस्ट पूर्ण हुआ (Submitted)</span>
          </div>
        )}
      </div>

      {/* RESULT VIEW */}
      {isSubmitted ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-gold/15 text-gold border-2 border-gold rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ★
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">आपका टेस्ट परिणाम (Score Card)</h2>
              <p className="text-xs text-gray-400 mt-1">
                नीचे सभी प्रश्नों के सही उत्तर एवं विस्तृत हल की समीक्षा करें
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-navy p-4 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block uppercase">कुल प्राप्तांक</span>
                <span className="text-2xl font-black text-gold">{totalScore.toFixed(1)} / 10</span>
              </div>
              <div className="bg-navy p-4 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block uppercase">सही उत्तर</span>
                <span className="text-2xl font-black text-accentGreen">{correctCount}</span>
              </div>
              <div className="bg-navy p-4 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block uppercase">गलत उत्तर</span>
                <span className="text-2xl font-black text-rose-500">{wrongCount}</span>
              </div>
              <div className="bg-navy p-4 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block uppercase">छोड़े गए प्रश्न</span>
                <span className="text-2xl font-black text-gray-400">{unattemptedCount}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-gold hover:bg-yellow-400 text-navy font-bold rounded-xl transition flex items-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुनः टेस्ट दें (Re-attempt)</span>
              </button>
              <Link
                href="/mock-tests"
                className="px-6 py-2.5 bg-navy border border-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition text-sm"
              >
                अन्य मॉक टेस्ट देखें
              </Link>
            </div>
          </div>

          {/* Solutions & Explanations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold" />
              <span>प्रश्नोत्तरी हल एवं व्याख्या (Detailed Solutions)</span>
            </h3>

            {SAMPLE_QUESTIONS.map((q, qIndex) => {
              const studentChoice = selectedAnswers[qIndex];
              const isCorrect = studentChoice === q.correctIndex;
              const isSkipped = studentChoice === undefined;

              return (
                <div
                  key={q.id}
                  className={`bg-navyLight border rounded-2xl p-5 space-y-3 ${
                    isCorrect
                      ? "border-accentGreen/40"
                      : isSkipped
                      ? "border-gray-800"
                      : "border-red-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-400">प्रश्न {qIndex + 1} of {SAMPLE_QUESTIONS.length}</span>
                    {isCorrect ? (
                      <span className="text-accentGreen font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> सही उत्तर (+2)
                      </span>
                    ) : isSkipped ? (
                      <span className="text-gray-400 font-medium">अनुत्तरित (0)</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> गलत उत्तर (-0.50)
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isOptionChosen = optIdx === studentChoice;

                      let style = "bg-navy border-gray-800 text-gray-300";
                      if (isOptionCorrect) {
                        style = "bg-accentGreen/15 border-accentGreen text-accentGreen font-bold";
                      } else if (isOptionChosen && !isOptionCorrect) {
                        style = "bg-rose-950/40 border-rose-500 text-rose-300";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                          <span>{opt}</span>
                          {isOptionCorrect && <Check className="w-4 h-4 text-accentGreen" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-navy/80 p-3 rounded-xl border border-gray-800 text-xs space-y-1">
                    <span className="text-gold font-semibold block">व्याख्या (Explanation):</span>
                    <p className="text-gray-300 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TEST RUNNING VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel */}
          <div className="lg:col-span-3 bg-navyLight border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 text-xs">
                <span className="font-bold text-gold">
                  प्रश्न संख्या: {currentIndex + 1} / {SAMPLE_QUESTIONS.length}
                </span>
                <span className="text-gray-400">मार्क्स: +2.0, -0.50</span>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? "bg-gold/20 border-gold text-white font-semibold shadow-inner"
                          : "bg-navy hover:bg-gray-800/80 border-gray-700/80 text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-gold text-navy" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClearResponse}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-rose-400 disabled:opacity-30 transition"
              >
                उत्तर हटाएं (Clear)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-navy border border-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>पिछला</span>
                </button>

                {currentIndex < SAMPLE_QUESTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-gold hover:bg-yellow-400 text-navy rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <span>अगला</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-5 py-2 bg-accentGreen hover:bg-green-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <span>टेस्ट सबमिट करें</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette */}
          <div className="bg-navyLight border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-gray-800 pb-2">
              प्रश्न तालिका (Question Palette)
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_QUESTIONS.map((q, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = idx === currentIndex;

                let btnStyle = "bg-navy text-gray-400 border-gray-700";
                if (isAnswered) {
                  btnStyle = "bg-accentGreen text-white border-accentGreen font-bold";
                }
                if (isCurrent) {
                  btnStyle += " ring-2 ring-gold ring-offset-2 ring-offset-navy";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-semibold transition ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-800 space-y-1.5 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-accentGreen rounded" />
                <span>उत्तर दिया गया: {Object.keys(selectedAnswers).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-navy border border-gray-700 rounded" />
                <span>उत्तर नहीं दिया: {SAMPLE_QUESTIONS.length - Object.keys(selectedAnswers).length}</span>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-accentGreen to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-green-900/20"
            >
              फाइनल सबमिट (Submit Test)
            </button>
          </div>
        </div>
      )}

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navyLight border border-gray-700 max-w-sm w-full rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white">क्या आप टेस्ट सबमिट करना चाहते हैं?</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              आपने <strong>{Object.keys(selectedAnswers).length}</strong> प्रश्नों के उत्तर दिए हैं, और{" "}
              <strong>{SAMPLE_QUESTIONS.length - Object.keys(selectedAnswers).length}</strong> प्रश्न छोड़ दिए हैं।
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 bg-navy border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  setIsSubmitted(true);
                }}
                className="flex-1 py-2.5 bg-accentGreen hover:bg-green-600 text-white rounded-xl text-xs font-bold transition shadow"
              >
                हाँ, सबमिट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
