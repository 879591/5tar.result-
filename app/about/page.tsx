import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Users, Target, Award, ArrowRight, Heart } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const metadata = {
  title: "हमारे बारे में (About Us) — 5tarResult",
  description: "5tarResult के बारे में जानें: भारत का विश्वसनीय शिक्षा एवं सरकारी नौकरी सूचना पोर्टल। संस्थापक Suraj Maurya का दृष्टिकोण।",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <span className="text-white">About Us</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-gold" />
          <span>हमारा परिचय व मिशन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          5tarResult: आपके सपनों की तैयारी, एक ही जगह!
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
          लाखों भारतीय विद्यार्थियों तक सरकारी नौकरी अलर्ट, प्रवेश परीक्षा परिणाम, फ्री मॉक टेस्ट और अध्ययन सामग्री बिना किसी शुल्क के पहुंचाना हमारा संकल्प है।
        </p>
      </div>

      {/* Founder Section */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-yellow-600 p-0.5 shrink-0 shadow-lg shadow-gold/20">
            <div className="w-full h-full bg-navy rounded-[14px] flex items-center justify-center text-gold font-black text-3xl">
              SM
            </div>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">Suraj Maurya</h2>
              <span className="text-xs bg-gold/20 text-gold font-semibold px-2.5 py-0.5 rounded-full border border-gold/40">
                Founder & Lead Editor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              &quot;प्रतियोगी परीक्षाओं की तैयारी के दौरान मैंने स्वयं देखा कि ग्रामीण एवं छोटे शहरों के छात्रों को सही समय पर आधिकारिक सूचनाएं नहीं मिल पातीं या फिर भ्रामक थंबनेल से उनका बहुमूल्य समय बर्बाद होता है। 5tarResult की नींव इसी समस्या को समाप्त करने और प्रत्येक छात्र को 100% सटीक, विज्ञापन-मुक्त और सत्यापित जानकारी प्रदान करने के लिए रखी गई है।&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-accentGreen/15 text-accentGreen flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">100% प्रामाणिक स्रोत</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            हम केवल केंद्र व राज्य सरकार के आधिकारिक राजपत्र (Gazette), आधिकारिक वेबसाइटों और भर्ती आयोगों के नोटिफिकेशन ही प्रकाशित करते हैं।
          </p>
        </div>

        <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">समय की बचत व तेज़ अपडेट</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            अनावश्यक क्लिक्स और भ्रामक लिंक्स से मुक्त, सीधा आधिकारिक डाउनलोड लिंक और एक-क्लिक आवेदन सुविधा।
          </p>
        </div>

        <div className="bg-navyLight border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">मुफ्त शिक्षा एवं टूल्स</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            ऑनलाइन सीबीटी मॉक टेस्ट, पिछले वर्षों के प्रश्न पत्र (PYQ), आयु कैलकुलेटर और सिलेबस नोट्स सभी छात्रों हेतु सदैव निशुल्क हैं।
          </p>
        </div>
      </div>

      {/* Editorial Process */}
      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">हमारी संपादकीय नीति (Editorial Policy)</h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          5tarResult की टीम प्रतिदिन दर्जनों आधिकारिक पोर्टलों (जैसे SSC, UPSC, NVS, CBSE, Railway, राज्य पुलिस बोर्ड) की समीक्षा करती है। किसी भी सूचना को वेबसाइट पर डालने से पहले न्यूनतम दो संपादकों द्वारा क्रॉस-वेरिफाई किया जाता है ताकि तिथियों या योग्यता विवरण में कोई त्रुटि न रहे।
        </p>
      </div>

      <AdBanner slot="about-page" format="horizontal" />
    </div>
  );
}
