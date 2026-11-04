import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client utilizing the SUPABASE_SERVICE_ROLE_KEY.
 * This client bypasses Row Level Security (RLS) for administrative tasks.
 * 
 * CRITICAL: NEVER import this into Client Components or expose the service role key!
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://satumsjfmpbjofhixkdi.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.warn(
      "[5tarResult] SUPABASE_SERVICE_ROLE_KEY is not set. Service-role admin operations will be limited."
    );
  }

  return createClient(url, serviceKey || "dummy-service-role-key-placeholder", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
