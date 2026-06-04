import type { LeadNotification } from "@/lib/notifications/types";

export type RenderedEmail = {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
};

const NOT_PROVIDED = "No indicado";

/** Escape the few characters that would break HTML / allow injection in email clients. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Format an ISO timestamp for Chilean staff; falls back to the raw value. */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(date);
}

/**
 * Render the staff notification email for a new RFQ. Pure: no side effects,
 * does not mutate its input — safe to unit test.
 */
export function renderNewLeadEmail(lead: LeadNotification): RenderedEmail {
  const phone = lead.phone ?? NOT_PROVIDED;
  const service = lead.service ?? NOT_PROVIDED;
  const receivedAt = formatDate(lead.receivedAt);

  const subject = `Nueva solicitud de cotización — ${lead.name}`;

  const rows: ReadonlyArray<readonly [string, string]> = [
    ["Nombre", lead.name],
    ["Correo", lead.email],
    ["Teléfono", phone],
    ["Servicio de interés", service],
    ["Origen", lead.source],
    ["Fecha de recepción", receivedAt],
  ];

  const text = [
    "Nueva solicitud de cotización recibida en el sitio web.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensaje:",
    lead.message,
    "",
    `Este lead quedó registrado en el CRM (id: ${lead.id}).`,
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${escapeHtml(
          label,
        )}</td><td style="padding:4px 0;color:#0f172a;"><strong>${escapeHtml(
          value,
        )}</strong></td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html lang="es"><body style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <h2 style="color:#ea580c;">Nueva solicitud de cotización</h2>
  <table style="border-collapse:collapse;font-size:14px;">${htmlRows}</table>
  <h3 style="margin-top:20px;">Mensaje</h3>
  <p style="white-space:pre-wrap;font-size:14px;">${escapeHtml(lead.message)}</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
  <p style="font-size:12px;color:#64748b;">Este lead quedó registrado en el CRM (id: ${escapeHtml(
    lead.id,
  )}).</p>
  </body></html>`;

  return { subject, html, text };
}
