import { buildWhatsAppUrl, WHATSAPP_URL_MAX_LENGTH } from "./whatsappUrl";

const BASE_URL = "https://wa.me/5491156137150?text=Hola";
const PAGE_URL = "https://example.com/productos";

describe("buildWhatsAppUrl", () => {
  it("preserves selection order in the message", () => {
    const products = [
      { title: "Broche Lona Macho Bronce Blanco" },
      { title: "Broche Lona Hembra Bronce" },
      { title: "Caballete Tubo Acero Inoxidable" },
    ];

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    // The URL should contain the titles in order, with bullet separators
    // "•" (U+2022) encodes to %E2%80%A2. Spaces encode as "+" (URLSearchParams
    // form-encoding, equivalent to %20 in query strings).
    expect(result.href).toContain("Broche+Lona+Macho+Bronce+Blanco");
    expect(result.href).toContain("%E2%80%A2+Broche+Lona+Hembra+Bronce");
    expect(result.href).toContain("%E2%80%A2+Caballete+Tubo+Acero+Inoxidable");

    // Verify order: b1 title appears before b2 title in the URL
    const idx1 = result.href.indexOf("Broche+Lona+Macho+Bronce+Blanco");
    const idx2 = result.href.indexOf("Broche+Lona+Hembra+Bronce");
    const idx3 = result.href.indexOf("Caballete");
    expect(idx1).toBeLessThan(idx2);
    expect(idx2).toBeLessThan(idx3);

    expect(result.isTooLong).toBe(false);
  });

  it("returns isTooLong=false and non-empty href for typical catalog size", () => {
    const products = Array.from({ length: 14 }, (_, i) => ({
      title: `Producto ${i + 1} con nombre realista`,
    }));

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(false);
    expect(result.href).not.toBe("");
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(WHATSAPP_URL_MAX_LENGTH);
  });

  it("returns isTooLong=true and empty href when URL exceeds max length", () => {
    // Synthesize products with long titles to exceed 1800 chars
    const products = Array.from({ length: 200 }, (_, i) => ({
      title: `Producto número ${i + 1} con un nombre extremadamente largo para forzar el límite de caracteres`,
    }));

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(true);
    expect(result.href).toBe("");
    expect(result.length).toBeGreaterThan(WHATSAPP_URL_MAX_LENGTH);
  });

  it("handles special characters in product titles without throwing", () => {
    const products = [
      { title: 'Broche "Plus" & Caño — 1/2″' },
      { title: "Lona #3 (añejada) [ref. Ñ]" },
    ];

    const result = buildWhatsAppUrl(products, BASE_URL, PAGE_URL);

    expect(result.isTooLong).toBe(false);
    expect(result.href).not.toBe("");
    // Encoded special chars should be present
    expect(result.href).toContain("%26"); // &
    expect(result.href).toContain("Ca%C3%B1o"); // Caño
  });

  it("falls back to the canonical business number when baseUrl is undefined", () => {
    // VITE_WHATSAPP_URL isn't set in CI — the deployed bundle embeds
    // undefined. The CTA must still produce a working wa.me link.
    const products = [{ title: "Broche Casco Atornillado" }];
    const result = buildWhatsAppUrl(products, undefined, PAGE_URL);

    expect(result.isTooLong).toBe(false);
    expect(result.href).toMatch(/^https:\/\/wa\.me\/5491169906255\?text=/);
    expect(result.href).toContain("Broche+Casco+Atornillado");
  });

  it("falls back when baseUrl is an empty string", () => {
    const result = buildWhatsAppUrl([], "", PAGE_URL);
    expect(result.href).toMatch(/^https:\/\/wa\.me\/5491169906255\?text=/);
  });
});
