import { Resend } from "resend";

import { getNotificationsEnv } from "@/lib/env";
import { renderNewLeadEmail } from "@/lib/notifications/templates/new-lead";
import type {
  LeadNotification,
  NotificationChannel,
  NotifyResult,
} from "@/lib/notifications/types";

export type EmailMessage = {
  readonly from: string;
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
};

/** Low-level send seam. Injected in tests; defaults to the Resend SDK. */
export type EmailDeliverer = (
  message: EmailMessage,
) => Promise<{ id: string | null; error: string | null }>;

function resendDeliverer(apiKey: string): EmailDeliverer {
  return async (message) => {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    return {
      id: data?.id ?? null,
      error: error ? (error.message ?? String(error)) : null,
    };
  };
}

/**
 * Email notification channel backed by Resend.
 * `isConfigured` reflects env at construction time; when unconfigured the
 * dispatcher skips it and the lead is still captured (graceful degradation).
 * `send()` never throws — delivery failures are mapped to `{ ok: false }`.
 */
export function createEmailChannel(
  deliverer?: EmailDeliverer,
): NotificationChannel {
  const result = getNotificationsEnv();

  return {
    name: "email",
    isConfigured: result.ok,
    async send(notification: LeadNotification): Promise<NotifyResult> {
      if (!result.ok) {
        return {
          ok: false,
          channel: "email",
          error: "Email channel not configured",
        };
      }

      const { subject, html, text } = renderNewLeadEmail(notification);
      const deliver = deliverer ?? resendDeliverer(result.env.resendApiKey);

      try {
        const { id, error } = await deliver({
          from: result.env.fromEmail,
          to: result.env.toEmail,
          subject,
          html,
          text,
        });
        if (error) {
          return { ok: false, channel: "email", error };
        }
        return { ok: true, channel: "email", id: id ?? undefined };
      } catch (error) {
        return {
          ok: false,
          channel: "email",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
