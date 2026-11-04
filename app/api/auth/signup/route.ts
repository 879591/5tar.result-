import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, fullName, qualification, classLevel } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({
        success: false,
        error: "कृपया एक वैध ईमेल पता दर्ज करें।",
      });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({
        success: false,
        error: "पासवर्ड कम से कम 6 अक्षरों का होना आवश्यक है।",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || "विद्यार्थी";
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1. If Service Role Key is available, use Admin Client for robust creation
    if (serviceRoleKey) {
      try {
        const adminSupabase = createAdminClient();

        // Check if user already exists
        const { data: userList } = await adminSupabase.auth.admin.listUsers();
        const existing = userList?.users?.find(
          (u: any) => u.email?.toLowerCase() === trimmedEmail
        );

        if (existing) {
          return NextResponse.json({
            success: false,
            error: "यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।",
          });
        }

        // Create user with verified email
        const { data: created, error: createError } = await adminSupabase.auth.admin.createUser({
          email: trimmedEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            qualification: qualification || "12th",
            class_level: classLevel || "Competition",
          },
        });

        if (createError) {
          return NextResponse.json({
            success: false,
            error: createError.message || "पंजीकरण में त्रुटि हुई।",
          });
        }

        // Create or update profile row
        if (created?.user?.id) {
          await adminSupabase.from("profiles").upsert({
            id: created.user.id,
            full_name: cleanName,
            qualification: qualification || "12th",
            class_level: classLevel || "Competition",
            updated_at: new Date().toISOString(),
          });
        }

        return NextResponse.json({
          success: true,
          message: "पंजीकरण सफल! आपका खाता बन गया है। अब आप लॉगिन कर सकते हैं।",
          userId: created?.user?.id,
        });
      } catch (adminErr: any) {
        console.warn("[Signup Admin Fallback]", adminErr);
      }
    }

    // 2. Standard Supabase SSR client fallback
    if (supabaseAnonKey) {
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

      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            qualification: qualification || "12th",
            class_level: classLevel || "Competition",
          },
        },
      });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message || "पंजीकरण विफल रहा।",
        });
      }

      return NextResponse.json({
        success: true,
        message: "पंजीकरण सफल! कृपया अपने इनबॉक्स में जाकर ईमेल सत्यापन लिंक पर क्लिक करें।",
      });
    }

    // 3. Fallback if keys are not configured
    return NextResponse.json({
      success: false,
      error:
        "Supabase क्रेडेंशियल्स अभी कॉन्फ़िगर नहीं हैं। कृपया 'मोबाइल OTP' टैब से तुरंत रजिस्टर करें, या Vercel में NEXT_PUBLIC_SUPABASE_ANON_KEY सेट करें।",
    });
  } catch (error: any) {
    console.error("[Signup Route Error]", error);
    return NextResponse.json({
      success: false,
      error: "पंजीकरण प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    });
  }
}
