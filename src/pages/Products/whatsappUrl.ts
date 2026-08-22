/**
 * Build a WhatsApp deep link with the selected products pre-filled as a
 * message. The user lands on WhatsApp with the message ready to send; long
 * messages (>1800 chars) return isTooLong so the UI can fall back to a
 * plain "open WhatsApp" link.
 *
 * The "Página" line points at the canonical products URL regardless of
 * where the CTA was clicked — keeps the message consistent and avoids
 * leaking localhost / preview origins into outbound WhatsApp messages.
 *
 * `baseUrl` is expected to look like `https://wa.me/<phone>?text=<preset>`.
 * We preserve the phone (and any other query params the caller added) and
 * replace `text` with the products message. Earlier versions concatenated
 * baseUrl + ' ' + encoded which produced two URLs joined by a space —
 * malformed and the browser dropped the products list.
 *
 * If `baseUrl` is missing (e.g. `VITE_WHATSAPP_URL` not set in CI / Cloudflare),
 * falls back to the canonical business number so the CTA never crashes.
 * Prefer setting the env var in Cloudflare Pages → Settings → Environment
 * variables so the preset greeting comes from your own copy.
 */
export interface BuildWhatsAppUrlResult {
  href: string;
  isTooLong: boolean;
  length: number;
}

export const WHATSAPP_URL_MAX_LENGTH = 1800;

import { data } from "../../mocks/data";

const PRODUCTS_CANONICAL_URL = "https://elmonoloneria.com/productos";

/** Fallback when `VITE_WHATSAPP_URL` is unset — canonical business number. */
const FALLBACK_WHATSAPP_BASE = "https://wa.me/5491169906255";

export function buildWhatsAppUrl(
  products: ReadonlyArray<{ title: string }>,
  baseUrl: string | undefined,
  pageUrl: string,
): BuildWhatsAppUrlResult {
  // `pageUrl` is ignored on purpose: see PRODUCTS_CANONICAL_URL above.
  void pageUrl;
  const message = [
    data.ui.whatsappGreeting,
    ...products.map((p) => `• ${p.title}`),
    "",
    `Página: ${PRODUCTS_CANONICAL_URL}`,
  ].join("\n");

  // Fallback for missing/empty VITE_WHATSAPP_URL — the env var is gitignored
  // and CI doesn't load `.env`, so the deployed bundle typically has the URL
  // missing unless Cloudflare Pages is configured with it explicitly.
  const safeBase = baseUrl && baseUrl.length > 0 ? baseUrl : FALLBACK_WHATSAPP_BASE;

  // Parse the caller's base URL so we don't lose the phone (or any extra
  // query params they may have set). Override only `text` with our message.
  const [basePart, queryPart = ""] = safeBase.split("?");
  const params = new URLSearchParams(queryPart);
  params.set("text", message);
  const href = `${basePart}?${params.toString()}`;

  if (href.length > WHATSAPP_URL_MAX_LENGTH) {
    return { href: "", isTooLong: true, length: href.length };
  }

  return { href, isTooLong: false, length: href.length };
}