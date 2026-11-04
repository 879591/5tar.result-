import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  try {
    const cookieStore = cookies();
    const phone = cookieStore.get("5tar_verified_phone")?.value;
    const name = cookieStore.get("5tar_user_name")?.value;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseAnonKey) {
      try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {},
          },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return NextResponse.json({
            authenticated: true,
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone || phone,
              full_name: user.user_metadata?.full_name || name || "विद्यार्थी",
            },
          });
        }
      } catch (err) {
        // Fallback to phone cookie
      }
    }

    if (phone) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: `user_${phone.replace(/\D/g, "")}`,
          phone: phone,
          full_name: name || "विद्यार्थी",
        },
      });
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
