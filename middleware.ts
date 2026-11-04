import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STUDENT_PROTECTED_PREFIXES = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // 1. Check verified mobile session cookie
  const verifiedPhone = request.cookies.get("5tar_verified_phone")?.value;

  // 2. Check Supabase Auth user if configured
  let hasSupabaseUser = false;
  let supabaseRole = "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            } catch {}
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        hasSupabaseUser = true;
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role) {
          supabaseRole = profile.role;
        }
      }
    } catch (err) {
      // Handled
    }
  }

  const isUserAuthenticated = Boolean(verifiedPhone || hasSupabaseUser);

  // 3. Protect Student Portal routes (/dashboard, /profile)
  const isStudentProtected = STUDENT_PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isStudentProtected && !isUserAuthenticated) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("login", "required");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
