import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-navyLight border border-gray-700/60 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">सत्यापन त्रुटि (Auth Error)</h1>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          लॉगिन लिंक समाप्त हो गया है या अमान्य है। कृपया मुख्य पृष्ठ पर वापस जाएं और पुनः लॉगिन करने का प्रयास करें।
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-yellow-500 text-navy font-semibold rounded-xl transition duration-150 shadow-md w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          मुख्य पृष्ठ पर जाएं (Go Home)
        </Link>
      </div>
    </div>
  );
}
