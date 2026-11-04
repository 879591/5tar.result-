import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { normalizeIndianPhone, verifyStoredOtp } from "@/lib/auth/otp-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, otp, fullName, qualification, classLevel } = body;

    const phone10 = normalizeIndianPhone(phone);
    if (!phone10) {
      return NextResponse.json({
        success: false,
        error: "अमान्य मोबाइल नंबर! कृपया 10 अंकों का वैध भारतीय नंबर दर्ज करें।",
      });
    }

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json({
        success: false,
        error: "कृपया 6 अंकों का सही OTP कोड दर्ज करें।",
      });
    }

    // 1. Verify OTP against salted hash in store
    const verification = verifyStoredOtp(phone10, otp.trim());
    if (!verification.success) {
      return NextResponse.json({
        success: false,
        error: verification.error || "गलत OTP कोड दर्ज किया गया है।",
      });
    }

    // 2. OTP is verified! Now integrate with Supabase Auth & Profiles
    const formattedPhone = `+91${phone10}`;
    const cookieStore = cookies();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let userId: string = `user_${phone10}`;
    let isExistingUser = false;
    let userName = fullName || "विद्यार्थी";

    if (serviceRoleKey) {
      try {
        const adminSupabase = createAdminClient();

        // 2a. Check if a profile with this phone already exists to avoid duplicates
        const { data: existingProfile } = await adminSupabase
          .from("profiles")
          .select("*")
          .or(`phone.eq.${formattedPhone},phone.eq.${phone10}`)
          .maybeSingle();

        if (existingProfile) {
          userId = existingProfile.id;
          isExistingUser = true;
          userName = existingProfile.full_name || userName;
        } else {
          // 2b. Check in auth.users by phone
          const { data: userList } = await adminSupabase.auth.admin.listUsers();
          const foundAuthUser = userList?.users?.find(
            (u: any) => u.phone === formattedPhone || u.phone === phone10
          );

          if (foundAuthUser) {
            userId = foundAuthUser.id;
            isExistingUser = true;
          } else {
            // 2c. Create new verified user without fake credentials
            const { data: newUserData, error: createError } = await adminSupabase.auth.admin.createUser({
              phone: formattedPhone,
              phone_confirm: true,
              user_metadata: {
                full_name: userName,
                qualification: qualification || "12th",
                class_level: classLevel || "Competition",
                verified_via: "Fast2SMS_OTP",
              },
            });

            if (!createError && newUserData?.user) {
              userId = newUserData.user.id;
            }
          }

          // 2d. Upsert into public.profiles
          await adminSupabase.from("profiles").upsert({
            id: userId,
            phone: formattedPhone,
            full_name: userName,
            qualification: qualification || "12th",
            class_level: classLevel || "Competition",
            updated_at: new Date().toISOString(),
          });
        }
      } catch (dbError) {
        console.warn("[Supabase OTP Auth Fallback Active]", dbError);
      }
    }

    // 3. Issue Session Cookies for persistence across the entire site
    cookieStore.set("5tar_verified_phone", formattedPhone, {
      httpOnly: false, // Accessible to client-side scripts to maintain sync
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    cookieStore.set("5tar_user_name", userName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: isExistingUser
        ? `लॉगिन सफल! स्वागत है, ${userName}।`
        : `सत्यापन सफल! आपका नया खाता बन गया है, स्वागत है ${userName}।`,
      isExistingUser,
      user: {
        id: userId,
        phone: formattedPhone,
        full_name: userName,
        qualification: qualification || "12th",
        class_level: classLevel || "Competition",
      },
    });
  } catch (error: any) {
    console.error("[Verify OTP Error]", error);
    return NextResponse.json({
      success: false,
      error: "सत्यापन प्रक्रिया में त्रुटि। कृपया पुनः प्रयास करें।",
    });
  }
}
