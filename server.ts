import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Use this client in Server Components, Route Handlers, and Server Actions.
 * Reads/writes the user's session cookie server-side.
 * Never import this into a "use client" file.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // Called from a Server Component without a mutable cookie jar —
            // safe to ignore if middleware.ts is refreshing sessions.
          }
        },
      },
    }
  );
}
