/**
 * Type definitions for centralized mock data.
 * All interfaces used by `data.ts` live here — data.ts contains NO type definitions.
 */

// ─── Re-exports from component type modules ──────────────────────────────
export type { Highlight, AboutCta } from "../types/about";
export type { Work } from "../types/work";
export type { Review } from "../types/review";
export type { AccordionItem } from "../components/ui/Accordion/Accordion.types";
export type { Categoria, Trabajo } from "../types/trabajo";

// For local use in this file
import type { Categoria, Trabajo } from "../types/trabajo";

// ─── Unions ──────────────────────────────────────────────────────────────
export type SocialPlatform = "Facebook" | "Instagram";
export type ContactIconKey = "phone" | "mail" | "mapPin";

// ─── Navigation ──────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

export interface ContactItem {
  label: string;
  value: string;
  href: string;
  iconKey: ContactIconKey;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface FooterNav {
  groups: NavGroup[];
  social: SocialLink[];
  contact: ContactItem[];
}

// ─── Hero ────────────────────────────────────────────────────────────────
export interface HeroVideo {
  /** Public video URL (static assets under `public/`). */
  src: string;
  /** Fallback source (MP4) when WebM is unsupported. */
  srcFallback: string;
  /** Optimized poster (WebP) shown until the video loads. */
  poster: string;
  alt: string;
}

export interface HeroData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  videos: HeroVideo[];
}

// ─── Sections ────────────────────────────────────────────────────────────
export interface SectionData {
  eyebrow: string;
  title: string;
  theme?: "dark" | "light";
  titlesAlign?: "start" | "center" | "end";
}

export interface SectionsGroup {
  whatWeOffer: SectionData;
  aboutUs: SectionData;
  testimonials: SectionData;
  faq: SectionData;
}

export interface AboutUsContent {
  description: string;
  cta: { text: string; href: string };
}

// ─── Split cards ─────────────────────────────────────────────────────────
export interface SplitCardData {
  title: string;
  /** Image key — resolved by the consuming page via a Record<imageKey, string> map. */
  imageKey: string;
}

// ─── Masonry Items (Home page) ────────────────────────────────────────────
export interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  alt?: string;
  title?: string;
  redirectUrl?: string;
  /** Optional card eyebrow shown above the title (Home mosaic presentation). */
  eyebrow?: string;
  /** Optional chips shown under the title (Home mosaic presentation). */
  chips?: string[];
}

// ─── Brands ──────────────────────────────────────────────────────────────
export interface BrandData {
  id: string;
  alt: string;
  link?: string;
  /** Image key — resolved by BrandMarquee via a Record<id, string> map. */
}

// ─── Products ────────────────────────────────────────────────────────────
export interface ProductData {
  id: string;
  title: string;
  description: string;
  /** Image key — resolved by Products page via a Record<imageKey, string> map. */
  imageKey: string;
}

export interface ProductCategoryData {
  id: string;
  name: string;
  /** Category description — shown as the answer bubble beside the title. */
  description: string;
  /** Image key for the "applied" photo (product in use, not isolated). */
  imageKey: string;
  /** YouTube Short URL reproduced in the category's MediaPlayer. Optional while a video isn't available. */
  videoUrl?: string;
  products: ProductData[];
}

// ─── Works page ─────────────────────────────────────────────────────────
export interface WorksPageData {
  trabajos: Trabajo[];
}

export interface AlbumImage {
  id: string;
  img: string; // resolved URL (not imageKey)
  url: string;
  alt?: string;
  title?: string;
  /** ID of the trabajo this image belongs to — enables click→showcase navigation */
  trabajoId?: string;
  /** Category slug — enables filtering and hash sync */
  categoria?: Categoria;
  /** Index of this image within the trabajo's `imagenes` array — enables showing the exact clicked photo */
  imageIndex?: number;
  redirectUrl?: string;
}

// ─── UI copy ─────────────────────────────────────────────────────────────
export interface ModalCopy {
  title: string;
  description: string;
}

export interface UICopy {
  // Header CTAs
  ctaContactDesktop: string;
  ctaContactMobile: string;
  // Products — SectionHero
  catalogHeroTitle: string;
  catalogHeroDescription: string;
  // Works — SectionHero
  worksHeroTitle: string;
  worksHeroDescription: string;
  worksCategoriesLabel: string;
  // Products — modal / buttons
  consultWhatsApp: string;
  clearList: string;
  keepBrowsing: string;
  cancel: string;
  delete: string;
  quoteModal: ModalCopy;
  clearModal: ModalCopy;
  clearConfirmation: string;
  whatsappDisabledReason: string;
  noProductsSelected: string;
  // Leaf UI labels
  selectedLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  goToProductLabel: string;
  goToVideoLabel: string;
  categoriesLabel: string;
  contactWhatsAppLabel: string;
  selectedCountLabel: string;
  quoteCartLabel: string;
  clearListLabel: string;
  quoteLabel: string;
  vaciarButton: string;
  vaciarSelectionAriaLabel: string;
  clearListAriaLabel: string;
  // WhatsApp
  whatsappGreeting: string;
  // Footer
  contactSectionTitle: string;
  // Action bar (sticky bottom, all viewports)
  actionBarLabel: string;
}

// ─── Global ──────────────────────────────────────────────────────────────
export interface GlobalData {
  brandName: string;
  brandFullName: string;
  brandLogoAlt: string;
}

// ─── Legacy section types (discriminated union for Home.tsx) ─────────────
export interface ReviewsSection {
  id: "reviews";
  kind: "reviews";
  eyebrow: string;
  title: string;
}

export interface AboutUsSection {
  id: "aboutus";
  kind: "aboutus";
  eyebrow: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
  /** Gallery image keys — resolved by the consuming page via a Record<imageKey, string> map. */
  gallery?: { imageKey: string; alt: string }[];
  highlights?: { label: string; value: number }[];
  cta?: { text: string; href: string };
}

export type Section = ReviewsSection | AboutUsSection;

// ─── FAQ ─────────────────────────────────────────────────────────────────
/**
 * The 4 dimensions a customer asks about when evaluating a lonería.
 * Each one maps to an icon in `src/assets/logos/icons/`.
 */
export type FaqCategory = "insumos" | "servicios" | "tiempos" | "trabajos";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
}
