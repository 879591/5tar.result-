import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { error: "पासकोड दर्ज करना अनिवार्य है। (Passcode required)" },
        { status: 400 }
      );
    }

    const envAdminPasscode = process.env.ADMIN_PASSCODE;

    // Secure verification logic:
    // 1. If ADMIN_PASSCODE environment variable is configured, strictly compare against it.
    // 2. Default fallback passwords like "admin5star" are rejected in production.
    if (envAdminPasscode) {
      if (passcode === envAdminPasscode) {
        return NextResponse.json({
          success: true,
          message: "सत्यापन सफल (Authenticated)",
        });
      } else {
        return NextResponse.json(
          { error: "अमान्य एडमिन पासकोड! (Invalid Admin Passcode)" },
          { status: 401 }
        );
      }
    }

    // If ADMIN_PASSCODE is not set in environment yet, allow development onboarding
    // with a stern reminder to set ADMIN_PASSCODE in .env.local
    if (process.env.NODE_ENV === "development" && passcode === "admin5star") {
      return NextResponse.json({
        success: true,
        message: "डेवलपमेंट मोड में स्वीकृत। कृपया प्रोडक्शन हेतु .env में ADMIN_PASSCODE सेट करें।",
        warning: "ADMIN_PASSCODE environment variable is not set. Set it in .env for production.",
      });
    }

    return NextResponse.json(
      {
        error:
          "सर्वर पर ADMIN_PASSCODE कॉन्फ़िगर नहीं है। कृपया .env में ADMIN_PASSCODE सेट करें। (ADMIN_PASSCODE not configured)",
      },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "सर्वर सत्यापन त्रुटि (Internal server error)" },
      { status: 500 }
    );
  }
}
