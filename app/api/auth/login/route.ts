import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: "ईमेल और पासवर्ड दोनों आवश्यक हैं।",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error:
          "Supabase क्रेडेंशियल्स अभी कॉन्फ़िगर नहीं हैं। कृपया 'मोबाइल OTP' टैब से तुरंत लॉगिन करें, या Vercel में NEXT_PUBLIC_SUPABASE_ANON_KEY सेट करें।",
      });
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled
          }
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json({
          success: false,
          error: "गलत ईमेल या पासवर्ड! कृपया दोबारा जांचें। (Invalid credentials)",
        });
      } else if (error.message.includes("Email not confirmed")) {
        return NextResponse.json({
          success: false,
          error: "कृपया पहले अपने ईमेल में आए लिंक से सत्यापन करें।",
        });
      }
      return NextResponse.json({
        success: false,
        error: error.message || "लॉगिन विफल रहा।",
      });
    }

    return NextResponse.json({
      success: true,
      message: "लॉगिन सफल! स्वागत है 5tarResult में।",
      user: data.user,
    });
  } catch (error: any) {
    console.error("[Login Route Error]", error);
    return NextResponse.json({
      success: false,
      error: "लॉगिन प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    });
  }
}
