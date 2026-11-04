import React from "react";
import Link from "next/link";
import { AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const metadata = {
  title: "अस्वीकरण (Disclaimer) — 5tarResult",
  description: "5tarResult का आधिकारिक अस्वीकरण: गैर-सरकारी स्वतंत्र शैक्षिक पोर्टल। आधिकारिक भर्ती स्रोतों की पुष्टि।",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-gray-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <span className="text-white">Disclaimer</span>
      </div>

      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-gold" />
          <span>अस्वीकरण (Disclaimer)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">अंतिम अद्यतन: 01 जनवरी 2026</p>
      </div>

      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="bg-red-950/40 border border-red-800/80 p-4 rounded-xl text-red-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-1">महत्वपूर्ण वैधानिक घोषणा:</strong>
            <span>
              <strong>5tarResult (5tarresult.com)</strong> किसी भी सरकारी संस्था, मंत्रालय, राज्य सरकार, कर्मचारी चयन आयोग (SSC), या लोक सेवा आयोग (UPSC/State PSC) का आधिकारिक पोर्टल नहीं है। यह एक स्वतंत्र, गैर-सरकारी निजी शैक्षिक एवं सूचनात्मक पोर्टल है।
            </span>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. सूचनात्मक उद्देश्य</h2>
          <p>
            इस वेबसाइट पर प्रकाशित की जाने वाली सभी नौकरियां, एडमिट कार्ड, परीक्षा परिणाम, उत्तर कुंजी (Answer Key) और अध्ययन सामग्री केवल विद्यार्थियों की सुविधा एवं त्वरित सूचना के उद्देश्य से एकत्र की जाती है।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. आधिकारिक पुष्टि की अनिवार्यता</h2>
          <p>
            हम अपने पाठकों से पुरजोर आग्रह करते हैं कि किसी भी भर्ती में ऑनलाइन आवेदन करने, फॉर्म भरने, अथवा परीक्षा शुल्क जमा करने से पूर्व संबंधित विभाग/आयोग की आधिकारिक वेबसाइट एवं आधिकारिक विज्ञप्ति (Notification PDF) का भलीभांति अध्ययन अवश्य करें।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. कोई शुल्क नहीं (Zero Hidden Fees)</h2>
          <p>
            5tarResult वेबसाइट पर सूचना देखने, सिलेबस डाउनलोड करने या मॉक टेस्ट देने के लिए छात्रों से कोई भी शुल्क नहीं लेता है। यदि कोई व्यक्ति 5tarResult के नाम पर नौकरी दिलवाने या फॉर्म भरने के नाम पर आपसे पैसे मांगता है, तो तुरंत सतर्क रहें।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. बाहरी लिंक्स (External Links)</h2>
          <p>
            हमारी वेबसाइट में विभिन्न आधिकारिक भर्ती बोर्डों (उदा. ssc.gov.in, upsconline.nic.in, navodaya.gov.in) के बाहरी लिंक दिए गए हैं। हम बाहरी वेबसाइटों की सामग्री या उनकी गोपनीयता नीतियों के लिए उत्तरदायी नहीं हैं।
          </p>
        </section>
      </div>

      <AdBanner slot="disclaimer-bottom" format="horizontal" />
    </div>
  );
}
