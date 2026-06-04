import { z } from "zod";

/**
 * Notifications domain types. A notification is only ever built from a lead
 * that has already been persisted, so `id` is required — this enforces the
 * persist-before-notify guarantee at the type/validation boundary.
 */

export const leadNotificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  service: z.string().nullable(),
  message: z.string(),
  source: z.string(),
  /** ISO timestamp string. */
  receivedAt: z.string(),
});

export type LeadNotification = z.infer<typeof leadNotificationSchema>;

export type NotifyResult =
  | { readonly ok: true; readonly channel: string; readonly id?: string }
  | { readonly ok: false; readonly channel: string; readonly error: string };

/**
 * A delivery channel (email now, WhatsApp later). Every channel implements this
 * identically; adding a channel is a new file, never a refactor of callers.
 */
export interface NotificationChannel {
  readonly name: string;
  /** false → the dispatcher skips this channel and logs (graceful degradation). */
  readonly isConfigured: boolean;
  send(notification: LeadNotification): Promise<NotifyResult>;
}
