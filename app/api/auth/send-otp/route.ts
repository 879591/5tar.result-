import { NextResponse } from "next/server";
import crypto from "crypto";
import { normalizeIndianPhone, registerNewOtp } from "@/lib/auth/otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone } = body;

    const phone10 = normalizeIndianPhone(phone);
    if (!phone10) {
      return NextResponse.json(
        { 
          success: false, 
          error: "अमान्य मोबाइल नंबर! कृपया 10 अंकों का वैध भारतीय नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से हो)।" 
        },
        { status: 200 }
      );
    }

    // 1. Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();

    // 2. Register with rate limiting, cooldown, and secure salted hashing
    const registration = registerNewOtp(phone10, rawOtp);
    if (!registration.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: registration.error, 
          retryAfter: registration.retryAfterSeconds 
        },
        { status: 200 }
      );
    }

    // 3. Fast2SMS API integration
    const apiKey = process.env.FAST2SMS_API_KEY;

    // If Fast2SMS API key is not yet configured, provide test OTP so the user can test their portal!
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        previewMode: true,
        testOtp: rawOtp,
        cooldownSeconds: 30,
        message: `परीक्षण OTP: ${rawOtp} (लाइव SMS के लिए Vercel में FAST2SMS_API_KEY जोड़ें)`,
        requiresConfig: true,
      });
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

      const fast2smsData = await fast2smsResponse.json().catch(() => null);

      if (!fast2smsResponse.ok || !fast2smsData?.return) {
        console.error("[Fast2SMS Error]", fast2smsData);
        return NextResponse.json({
          success: false,
          error:
            fast2smsData?.message?.[0] ||
            "Fast2SMS द्वारा SMS भेजने में असमर्थ। कृपया अपना Fast2SMS वॉलेट बैलेंस जांचें।",
        });
      }

      return NextResponse.json({
        success: true,
        message: `OTP सफलतापूर्वक मोबाइल नंबर +91-${phone10} पर SMS द्वारा भेज दिया गया है।`,
        cooldownSeconds: 60,
      });
    } catch (smsError: any) {
      console.error("[Fast2SMS Fetch Exception]", smsError);
      return NextResponse.json({
        success: false,
        error: "SMS गेटवे से संपर्क स्थापित नहीं हो सका। कृपया पुनः प्रयास करें।",
      });
    }
  } catch (error: any) {
    console.error("[Send OTP Route Error]", error);
    return NextResponse.json({
      success: false,
      error: "सर्वर से कनेक्ट करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।",
    });
  }
}
