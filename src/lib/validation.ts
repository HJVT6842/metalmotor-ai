import { z } from "zod";

/**
 * Boundary validation schemas. Every external input (contact form, API body)
 * must be parsed through these before it touches the rest of the system.
 */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre")
    .max(120, "Nombre demasiado largo"),
  email: z.string().trim().email("Correo electrónico inválido").max(160),
  phone: z
    .string()
    .trim()
    .max(40, "Teléfono demasiado largo")
    .optional()
    .or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más sobre tu proyecto")
    .max(2000, "Mensaje demasiado largo"),
  /** Honeypot field — must stay empty. Bots tend to fill every input. */
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Shape persisted as a lead, derived from validated contact input. */
export type LeadRecord = {
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly service: string | null;
  readonly message: string;
  readonly source: string;
};

export function toLeadRecord(
  input: ContactInput,
  source = "website_contact_form",
): LeadRecord {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone ? input.phone : null,
    service: input.service ? input.service : null,
    message: input.message,
    source,
  };
}
