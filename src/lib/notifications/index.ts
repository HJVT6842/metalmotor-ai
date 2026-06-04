import { createEmailChannel } from "@/lib/notifications/email-resend";
import type {
  LeadNotification,
  NotificationChannel,
  NotifyResult,
} from "@/lib/notifications/types";

export type {
  LeadNotification,
  NotificationChannel,
  NotifyResult,
} from "@/lib/notifications/types";
export { leadNotificationSchema } from "@/lib/notifications/types";

/** Default channel registry. Add WhatsApp here later — no other change needed. */
function defaultChannels(): readonly NotificationChannel[] {
  return [createEmailChannel()];
}

/**
 * Dispatch a new-lead notification across all configured channels.
 *
 * Guarantees:
 * - Unconfigured channels are skipped and logged (never sent).
 * - A channel that throws is caught and reported as `{ ok: false }`.
 * - This function NEVER throws into the caller — the contact route relies on
 *   this so a notification failure can never drop a captured lead.
 */
export async function notifyNewLead(
  notification: LeadNotification,
  channels: readonly NotificationChannel[] = defaultChannels(),
): Promise<NotifyResult[]> {
  const active: NotificationChannel[] = [];
  for (const channel of channels) {
    if (channel.isConfigured) {
      active.push(channel);
    } else {
      console.warn(`[notifications] channel "${channel.name}" not configured — skipped`);
    }
  }

  return Promise.all(
    active.map(async (channel): Promise<NotifyResult> => {
      try {
        return await channel.send(notification);
      } catch (error) {
        return {
          ok: false,
          channel: channel.name,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );
}
