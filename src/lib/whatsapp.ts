/**
 * Pure helpers for building WhatsApp click-to-chat links.
 * No side effects — easy to unit test and safe to use on the client.
 */

/** Strip everything except digits from a phone number. */
export function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Build a wa.me click-to-chat URL with an optional pre-filled message.
 *
 * @param number  Phone in international format (with or without symbols).
 * @param message Optional pre-filled text.
 */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const normalized = normalizeNumber(number);
  const base = `https://wa.me/${normalized}`;
  if (!message || message.trim() === "") {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/** Default quotation message in Spanish for the main CTAs. */
export function quotationMessage(service?: string): string {
  if (service && service.trim() !== "") {
    return `Hola Metal Motor, quisiera cotizar el servicio de ${service.trim()}.`;
  }
  return "Hola Metal Motor, quisiera solicitar una cotización.";
}
