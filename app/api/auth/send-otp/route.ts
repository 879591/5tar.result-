import { NextResponse } from "next/server";
import crypto from "crypto";
import { normalizeIndianPhone, registerNewOtp } from "@/lib/auth/otp-store";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    const phone10 = normalizeIndianPhone(phone);
    if (!phone10) {
      return NextResponse.json(
        { error: "अमान्य मोबाइल नंबर! कृपया 10 अंकों का वैध भारतीय नंबर दर्ज करें (+91)।" },
        { status: 400 }
      );
    }

    // 1. Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();

    // 2. Register with rate limiting, cooldown, and secure salted hashing
    const registration = registerNewOtp(phone10, rawOtp);
    if (!registration.success) {
      return NextResponse.json(
        { error: registration.error, retryAfter: registration.retryAfterSeconds },
        { status: 429 }
      );
    }

    // 3. Fast2SMS API integration
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Fast2SMS API Key कॉन्फ़िगर नहीं है। कृपया .env.local में FAST2SMS_API_KEY सेट करें।",
          requiresConfig: true,
        },
        { status: 503 }
      );
    }

    // Official Fast2SMS bulkV2 OTP Route call
    try {
      const fast2smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: rawOtp,
          numbers: phone10,
        }),
      });

      const fast2smsData = await fast2smsResponse.json();

      if (!fast2smsResponse.ok || !fast2smsData.return) {
        console.error("[Fast2SMS Error]", fast2smsData);
        return NextResponse.json(
          {
            error:
              fast2smsData?.message?.[0] ||
              "Fast2SMS द्वारा SMS भेजने में असमर्थ। कृपया अपना Fast2SMS वॉलेट बैलेंस जांचें।",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `OTP सफलतापूर्वक मोबाइल नंबर +91-${phone10} पर भेज दिया गया है।`,
        cooldownSeconds: 60,
      });
    } catch (smsError: any) {
      console.error("[Fast2SMS Fetch Exception]", smsError);
      return NextResponse.json(
        { error: "SMS गेटवे से संपर्क स्थापित नहीं हो सका। कृपया पुनः प्रयास करें।" },
        { status: 502 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "सर्वर त्रुटि। कृपया थोड़ी देर बाद पुनः प्रयास करें।" },
      { status: 500 }
    );
  }
}
