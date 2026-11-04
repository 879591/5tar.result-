"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, Send, User, Sparkles, ArrowLeft, RefreshCw, 
  HelpCircle, CheckCircle, BookOpen 
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const PRESET_QUESTIONS = [
  "SSC GD 2026 की योग्यता और परीक्षा पैटर्न क्या है?",
  "नवोदय विद्यालय कक्षा 6 में प्रवेश के लिए तैयारी कैसे करें?",
  "UP Police कांस्टेबल के लिए हिंदी और सामान्य ज्ञान के मुख्य टॉपिक क्या हैं?",
  "रेलवे भर्ती में ITI वालों के लिए कौन-कौन से पद हैं?",
  "सरकारी नौकरी की तैयारी के लिए सबसे अच्छा टाइम टेबल क्या होना चाहिए?",
];

export default function AiHelpPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "नमस्ते विद्यार्थी! 🙏 मैं 5tarResult का AI विद्या सहायक हूँ। सरकारी नौकरी, नवोदय प्रवेश, सिलेबस, कट-ऑफ या पढ़ाई की रणनीति से जुड़ा कोई भी प्रश्न पूछें।",
      time: "अभी",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply || "उत्तर प्राप्त करने में त्रुटि हुई। कृपया दोबारा पूछें।",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "सर्वर से संपर्क करने में असमर्थ। कृपया अपना नेटवर्क जांचें।",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-navyLight border border-gray-700 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">5tarResult AI विद्या सहायक</h1>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                  24x7 सक्रिय
                </span>
              </div>
              <p className="text-xs text-gray-400">
                सटीक परीक्षा मार्गदर्शन एवं सिलेबस सहायता
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                role: "assistant",
                content: "बातचीत रीसेट हो गई है। आप नया सवाल पूछ सकते हैं!",
                time: "अभी",
              },
            ]);
          }}
          className="text-xs text-gray-400 hover:text-white p-2 rounded-lg hover:bg-navyLight flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">नई बातचीत</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          अक्सर पूछे जाने वाले सवाल:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left text-xs bg-navyLight hover:bg-purple-950/40 hover:border-purple-500/50 text-gray-300 hover:text-white border border-gray-700/80 px-3 py-1.5 rounded-xl transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-4 sm:p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4 shadow-xl">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-gold text-navy"
                    : "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-gold text-navy font-medium rounded-tr-none shadow"
                    : "bg-navy border border-gray-700/80 text-gray-200 rounded-tl-none whitespace-pre-line shadow"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span
                  className={`text-[10px] block mt-1.5 ${
                    isUser ? "text-navy/70 text-right" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-navy border border-gray-700 p-3 rounded-2xl text-xs text-gray-400 animate-pulse">
              AI उत्तर तैयार कर रहा है...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="अपना सवाल यहाँ लिखें (उदा. SSC GD में कट-ऑफ कितना जाता है?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full bg-navyLight border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none shadow-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
        >
          <span>भेजें</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
