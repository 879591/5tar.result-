import React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, CheckCircle } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const metadata = {
  title: "गोपनीयता नीति (Privacy Policy) — 5tarResult",
  description: "5tarResult की आधिकारिक गोपनीयता नीति। जानें कि हम उपयोगकर्ता डेटा, कुकीज़ और Google AdSense नीतियों का कैसे पालन करते हैं।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-gray-300 text-xs sm:text-sm leading-relaxed">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <span className="text-white">Privacy Policy</span>
      </div>

      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-xs text-gray-400 mt-1">अंतिम अद्यतन: 01 जनवरी 2026</p>
      </div>

      <div className="bg-navyLight border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            <span>1. परिचय एवं हमारी प्रतिबद्धता</span>
          </h2>
          <p>
            5tarResult (&quot;हम&quot;, &quot;हमारा&quot;, या &quot;वेबसाइट&quot;) पर आने वाले प्रत्येक विद्यार्थी और आगंतुक की गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह गोपनीयता नीति दस्तावेज स्पष्ट करता है कि जब आप 5tarresult.com पर आते हैं, तो किस प्रकार की व्यक्तिगत जानकारी प्राप्त और एकत्रित की जाती है तथा इसका उपयोग कैसे किया जाता है।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-accentGreen" />
            <span>2. एकत्रित की जाने वाली जानकारी</span>
          </h2>
          <p>
            हम केवल वही जानकारी एकत्रित करते हैं जो शैक्षिक सेवाएं, मॉक टेस्ट विश्लेषण और जॉब अलर्ट प्रदान करने के लिए आवश्यक हो:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-400">
            <li><strong>खाता पंजीकरण जानकारी:</strong> जब आप वेबसाइट पर पंजीकरण करते हैं, तो नाम, ईमेल पता, फोन नंबर और लक्षित शैक्षणिक योग्यता (जैसे 10वीं, 12वीं, या स्नातक)।</li>
            <li><strong>लॉग डेटा (Log Files):</strong> अन्य मानक वेबसाइटों की तरह, हम इंटरनेट प्रोटोकॉल (IP) पते, ब्राउज़र प्रकार, इंटरनेट सेवा प्रदाता (ISP), दिनांक/समय स्टैम्प और देखे गए पृष्ठों का गैर-व्यक्तिगत तकनीकी डेटा एकत्रित करते हैं।</li>
            <li><strong>मॉक टेस्ट परिणाम:</strong> अभ्यास परीक्षणों में छात्रों द्वारा प्राप्त अंक व प्रदर्शन रिकॉर्ड।</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>3. कुकीज़ एवं वेब बीकन (Cookies & Web Beacons)</span>
          </h2>
          <p>
            5tarResult आगंतुकों की प्राथमिकताओं को रिकॉर्ड करने, उपयोगकर्ता-विशिष्ट जानकारी दर्ज करने और उपयोगकर्ता के ब्राउज़र प्रकार या अन्य जानकारी के आधार पर वेब पेज सामग्री को अनुकूलित करने के लिए मानक कुकीज़ का उपयोग करता है।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>4. Google AdSense एवं DoubleClick DART कुकी नीति</span>
          </h2>
          <p>
            Google हमारी साइट पर एक तृतीय-पक्ष विज्ञापन विक्रेता (Third-party Vendor) है। Google हमारी साइट और इंटरनेट पर अन्य साइटों पर आने वाले उपयोगकर्ताओं को विज्ञापन दिखाने के लिए DART कुकीज़ का भी उपयोग करता है।
          </p>
          <p className="bg-navy p-3 rounded-xl border border-gray-800 text-xs">
            उपयोगकर्ता निम्नलिखित यूआरएल पर जाकर Google विज्ञापन और सामग्री नेटवर्क गोपनीयता नीति की समीक्षा करके DART कुकी के उपयोग से बाहर निकल सकते हैं:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              https://policies.google.com/technologies/ads
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">5. तृतीय-पक्ष गोपनीयता नीतियां (Third Party Privacy)</h2>
          <p>
            5tarResult की गोपनीयता नीति अन्य विज्ञापनदाताओं या बाहरी सरकारी वेबसाइटों पर लागू नहीं होती है। हम सलाह देते हैं कि अधिक विस्तृत जानकारी के लिए आप इन तृतीय-पक्ष विज्ञापन सर्वरों या भर्ती पोर्टलों की संबंधित गोपनीयता नीतियों से परामर्श करें।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">6. बाल सुरक्षा नीति (Children&apos;s Information)</h2>
          <p>
            इंटरनेट का उपयोग करते समय बच्चों के लिए सुरक्षा जोड़ना हमारी सर्वोच्च प्राथमिकता का एक और हिस्सा है। 5tarResult जानबूझकर 13 वर्ष से कम आयु के बच्चों से कोई व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करता है।
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-base font-bold text-white">7. सहमति (Consent)</h2>
          <p>
            हमारी वेबसाइट का उपयोग करके, आप हमारी गोपनीयता नीति के लिए सहमति देते हैं और इसके नियमों व शर्तों से सहमत होते हैं।
          </p>
        </section>
      </div>

      <AdBanner slot="privacy-bottom" format="horizontal" />
    </div>
  );
}
