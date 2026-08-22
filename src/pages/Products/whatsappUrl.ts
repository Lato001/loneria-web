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
 */
export interface BuildWhatsAppUrlResult {
  href: string;
  isTooLong: boolean;
  length: number;
}

export const WHATSAPP_URL_MAX_LENGTH = 1800;

import { data } from "../../mocks/data";

const PRODUCTS_CANONICAL_URL = "https://elmonoloneria.com/productos";

export function buildWhatsAppUrl(
  products: ReadonlyArray<{ title: string }>,
  baseUrl: string,
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

  // Parse the caller's base URL so we don't lose the phone (or any extra
  // query params they may have set). Override only `text` with our message.
  const [basePart, queryPart = ""] = baseUrl.split("?");
  const params = new URLSearchParams(queryPart);
  params.set("text", message);
  const href = `${basePart}?${params.toString()}`;

  if (href.length > WHATSAPP_URL_MAX_LENGTH) {
    return { href: "", isTooLong: true, length: href.length };
  }

  return { href, isTooLong: false, length: href.length };
}