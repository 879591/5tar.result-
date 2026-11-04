import { createBrowserClient } from "@supabase/ssr";

/**
 * Client for Client Components ("use client").
 * Handles graceful fallback if environment variables are not configured yet.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key-placeholder";

  try {
    return createBrowserClient(url, anonKey);
  } catch (err) {
    console.warn("[5tarResult] Supabase client init warning:", err);
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
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        verifyOtp: async () => ({ data: { user: null, session: null }, error: null }),
        signInWithOtp: async () => ({ data: {}, error: null }),
      },
      from: () => queryBuilder,
    } as any;
  }
}
