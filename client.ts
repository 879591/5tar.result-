import { createBrowserClient } from "@supabase/ssr";

/**
 * Use this client in Client Components ("use client").
 * Only ever reads the PUBLIC env vars — safe to ship to the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
