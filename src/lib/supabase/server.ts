import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "@/lib/env";

/**
 * Lazily create a Supabase client using the service-role key (server only).
 *
 * Returns null when Supabase is not configured so callers can degrade
 * gracefully (e.g. still accept a lead and notify staff) instead of throwing.
 * The service-role key bypasses RLS and must never reach the client bundle —
 * `server-only` enforces that at build time.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const result = getSupabaseServerEnv();
  if (!result.ok) {
    return null;
  }

  return createClient(result.env.SUPABASE_URL, result.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
