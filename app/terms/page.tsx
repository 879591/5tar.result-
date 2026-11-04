import React from "react";
import Link from "next/link";
import { FileCheck, AlertTriangle } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const metadata = {
  title: "नियम एवं शर्तें (Terms and Conditions) — 5tarResult",
  description: "5tarResult की वेबसाइट उपयोग नियम एवं शर्तें। पोर्टल के उपयोग से संबंधित छात्र नियम।",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-gray-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <span className="text-white">Terms & Conditions</span>
      </div>

      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          नियम एवं शर्तें (Terms & Conditions)
        </h1>
        <p className="text-xs text-gray-400 mt-1">अंतिम अद्यतन: 01 जनवरी 2026</p>
      </div>

      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. पोर्टल का उपयोग</h2>
          <p>
            5tarresult.com पर पहुंच कर और उसका उपयोग करके, आप इन नियमों और शर्तों का पूर्ण रूप से पालन करने के लिए बाध्य होने के लिए सहमत हैं। यदि आप इन सभी नियमों से सहमत नहीं हैं, तो कृपया पोर्टल का उपयोग न करें।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. बौद्धिक संपदा अधिकार एवं उचित उपयोग</h2>
          <p>
            5tarResult पर उपलब्ध अध्ययन नोट्स, मॉक टेस्ट और लेख शैक्षणिक और गैर-व्यावसायिक व्यक्तिगत अध्ययन उद्देश्यों के लिए प्रदान किए जाते हैं। किसी भी सामग्री का अनधिकृत व्यावसायिक पुनरुत्पादन या बिक्री सख्त वर्जित है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. जानकारी की शुद्धता</h2>
          <p>
            यद्यपि हम सभी सरकारी नौकरियों, तिथियों और परिणामों की 100% प्रामाणिकता सुनिश्चित करने का पूरा प्रयास करते हैं, फिर भी उपयोगकर्ताओं को सलाह दी जाती है कि वे आवेदन करने या शुल्क का भुगतान करने से पूर्व संबंधित विभाग की आधिकारिक अधिसूचना अवश्य जांचें।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. खाता सुरक्षा</h2>
          <p>
            यदि आप वेबसाइट पर अपना खाता बनाते हैं, तो आप अपने पासवर्ड और क्रेडेंशियल्स की गोपनीयता बनाए रखने के लिए स्वयं जिम्मेदार हैं।
          </p>
        </section>
      </div>

      <AdBanner slot="terms-bottom" format="horizontal" />
    </div>
  );
}
