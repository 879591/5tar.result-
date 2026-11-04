import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export interface AuthenticatedUser {
  id: string;
  phone?: string;
  email?: string;
  full_name: string;
  qualification?: string;
  class_level?: string;
  state?: string;
  district?: string;
  dob?: string;
  auth_type: "phone_otp" | "supabase_auth";
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = cookies();
  const phone = cookieStore.get("5tar_verified_phone")?.value;
  const name = cookieStore.get("5tar_user_name")?.value;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. Try Supabase Auth user first if keys exist
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
        return {
          id: user.id,
          email: user.email,
          phone: user.phone || phone,
          full_name: user.user_metadata?.full_name || name || "विद्यार्थी",
          qualification: user.user_metadata?.qualification || "12th",
          class_level: user.user_metadata?.class_level || "Competition",
          auth_type: "supabase_auth",
        };
      }
    } catch {
      // Fallback to verified phone
    }
  }

  // 2. Verified mobile phone cookie
  if (phone) {
    const rawDigits = phone.replace(/\D/g, "");
    return {
      id: `user_${rawDigits}`,
      phone: phone,
      full_name: name || "विद्यार्थी",
      qualification: "12th",
      class_level: "Competition",
      auth_type: "phone_otp",
    };
  }

  return null;
}
