import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrCreateUserData, updateUserData } from "@/lib/data/user-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = getOrCreateUserData(authUser.id, authUser.full_name, authUser.phone);
    return NextResponse.json({
      authenticated: true,
      profile: {
        id: data.userId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || authUser.email || "",
        dob: data.dob,
        qualification: data.qualification,
        classLevel: data.classLevel,
        state: data.state,
        district: data.district,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, dob, qualification, classLevel, state, district } = body;

    const updated = updateUserData(authUser.id, {
      fullName: fullName?.trim() || authUser.full_name,
      phone: phone?.trim() || authUser.phone || "",
      dob: dob || "2002-05-15",
      qualification: qualification || "12th",
      classLevel: classLevel || "Competition",
      state: state?.trim() || "Uttar Pradesh",
      district: district?.trim() || "वाराणसी",
    });

    // Update cookie name for client sync
    const cookieStore = cookies();
    if (fullName?.trim()) {
      cookieStore.set("5tar_user_name", fullName.trim(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    // Try Supabase admin upsert if key available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminSupabase = createAdminClient();
        await adminSupabase.from("profiles").upsert({
          id: authUser.id,
          full_name: updated.fullName,
          phone: updated.phone,
          dob: updated.dob,
          qualification: updated.qualification,
          class_level: updated.classLevel,
          state: updated.state,
          district: updated.district,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("[Profile save Supabase fallback]", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "विद्यार्थी प्रोफाइल सफलतापूर्वक सहेज ली गई है!",
      profile: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
