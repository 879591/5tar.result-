import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Use this client in Server Components, Route Handlers, and Server Actions.
 * Reads/writes the user's session cookie server-side.
 * Handles missing env vars gracefully.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key-placeholder";

  try {
    const cookieStore = cookies();

    return createServerClient(url, anonKey, {
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
            // Server Component without mutable cookie jar
          }
        },
      },
    });
  } catch (err) {
    console.warn("[5tarResult] Server Supabase client init warning:", err);
    const noOpResult = { data: [], error: null, count: 0 };
    const queryBuilder: any = new Proxy(() => {}, {
      get: (_target, prop) => {
        if (prop === "then") {
          return (resolve: any) => resolve(noOpResult);
        }
        return queryBuilder;
      },
      apply: () => queryBuilder,
    });
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        exchangeCodeForSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => queryBuilder,
    } as any;
  }
}
