import { z } from "zod";

/**
 * Server-side secret access, validated at the boundary.
 *
 * Secrets are NEVER hardcoded. We read them lazily so the app can build and run
 * locally (e.g. for the public landing page) even when Supabase is not yet
 * configured — the guard only throws when a feature that *needs* a secret is
 * actually invoked (the contact API).
 */

const serverEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export type EnvResult =
  | { readonly ok: true; readonly env: ServerEnv }
  | { readonly ok: false; readonly missing: readonly string[] };

/**
 * Returns validated Supabase server credentials, or a list of missing keys.
 * Callers decide how to degrade gracefully instead of crashing the process.
 */
export function getSupabaseServerEnv(): EnvResult {
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_URL:
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (parsed.success) {
    return { ok: true, env: parsed.data };
  }

  const missing = parsed.error.issues.map((issue) => String(issue.path[0]));
  return { ok: false, missing: [...new Set(missing)] };
}

/**
 * Notifications (Resend email) configuration.
 *
 * Only RESEND_API_KEY is mandatory; recipient and sender fall back to safe
 * defaults so the value is never hardcoded in business logic. Missing key →
 * the email channel reports itself unconfigured and is skipped (graceful: the
 * lead is still captured). Sender defaults to Resend's verified onboarding
 * address until the metalmotor.cl domain is verified in Resend.
 */
const DEFAULT_TO_EMAIL = "jantonio.vasquez.t@gmail.com";
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

export type NotificationsEnv = {
  readonly resendApiKey: string;
  readonly toEmail: string;
  readonly fromEmail: string;
};

export type NotificationsEnvResult =
  | { readonly ok: true; readonly env: NotificationsEnv }
  | { readonly ok: false; readonly missing: readonly string[] };

export function getNotificationsEnv(): NotificationsEnvResult {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) {
    return { ok: false, missing: ["RESEND_API_KEY"] };
  }

  return {
    ok: true,
    env: {
      resendApiKey,
      toEmail: process.env.NOTIFICATIONS_TO_EMAIL?.trim() || DEFAULT_TO_EMAIL,
      fromEmail:
        process.env.NOTIFICATIONS_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
    },
  };
}
