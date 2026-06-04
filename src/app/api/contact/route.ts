import { NextResponse } from "next/server";

import { notifyNewLead } from "@/lib/notifications";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { contactSchema, toLeadRecord } from "@/lib/validation";

/**
 * POST /api/contact
 * Accepts a lead from the public contact form. The lead is validated at the
 * boundary, persisted to Supabase when configured, and — only after a
 * successful persist — staff are notified by email (WhatsApp drops in later
 * via the same notifications interface).
 *
 * The lead is captured even if persistence/notification is not yet configured,
 * and a notification failure never drops a captured lead.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo de la solicitud inválido." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { ok: false, error: "Datos inválidos.", fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot triggered → pretend success, drop silently.
  if (parsed.data.company && parsed.data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const lead = toLeadRecord(parsed.data);

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("leads")
        .insert(lead)
        .select("id")
        .single();
      if (error) {
        console.error("Supabase insert failed:", error.message);
        return NextResponse.json(
          {
            ok: false,
            error:
              "No pudimos registrar tu solicitud. Intenta nuevamente o escríbenos por WhatsApp.",
          },
          { status: 502 },
        );
      }

      // Persist-before-notify: only notify once the lead has a real id.
      // notifyNewLead never throws, but we guard anyway so a notification
      // failure can never turn into a dropped lead / error response.
      try {
        await notifyNewLead({
          ...lead,
          id: data.id,
          receivedAt: new Date().toISOString(),
        });
      } catch (notifyError) {
        console.error("Lead notification failed (lead is saved):", notifyError);
      }
    } else {
      // Not yet configured — log so the lead is recoverable from server logs.
      console.warn(
        "Supabase not configured; lead not persisted:",
        JSON.stringify({ name: lead.name, email: lead.email }),
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno. Intenta nuevamente más tarde." },
      { status: 500 },
    );
  }
}
