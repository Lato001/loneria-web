import { Link, useLocation } from "react-router-dom";
import {
  IconAnchor,
  IconArrowRight,
  IconBuildingFactory,
  IconHelp,
  IconMessage,
  IconPackage,
  IconTool,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { PATHS } from "../../../routes/routes";

/**
 * Canonical route order used for the "next page" CTA at the bottom of every
 * route. The last entry loops back to the first so Contact → Home completes
 * the journey instead of dropping the user off a cliff.
 *
 * Each entry carries a Tabler icon that hints at the destination's content:
 * the marine/canvas theme informs the set (Anchor for home, Tool for craft,
 * BuildingFactory for the workshop) so the CTA reads as a curated suggestion,
 * not just a generic "next" button.
 */
interface NextRoute {
  path: string;
  label: string;
  RouteIcon: Icon;
}

const NEXT_PATH_ORDER: ReadonlyArray<NextRoute> = [
  { path: PATHS.HOME, label: "Inicio", RouteIcon: IconAnchor },
  { path: PATHS.PRODUCTS, label: "Productos", RouteIcon: IconPackage },
  { path: PATHS.WORKS, label: "Trabajos", RouteIcon: IconTool },
  { path: PATHS.ABOUT_US, label: "Nosotros", RouteIcon: IconBuildingFactory },
  { path: PATHS.FAQ, label: "Preguntas Frecuentes", RouteIcon: IconHelp },
  { path: PATHS.CONTACT, label: "Contacto", RouteIcon: IconMessage },
];

/**
 * "Continue exploring" CTA rendered inside the last section of every route.
 * Aquamarine background with navy text — chosen as the single brand-accent
 * variant so the CTA reads consistently across every page regardless of the
 * host section's background.
 *
 * Reads the current path from useLocation, finds the next route in the
 * canonical order, and renders nothing when the user is on the 404 fallback
 * (path not in NEXT_PATH_ORDER).
 */
export function NextPageCta({ className }: { className?: string } = {}) {
  const { pathname } = useLocation();
  const index = NEXT_PATH_ORDER.findIndex((r) => r.path === pathname);
  if (index === -1) return null;
  const next = NEXT_PATH_ORDER[(index + 1) % NEXT_PATH_ORDER.length];
  return (
    <div className={`flex justify-end  ${className}`}>
      <Link
        to={next.path}
        className="inline-flex items-center gap-3 rounded-full bg-pr-aquamarine px-6 py-3 font-poppins text-base font-bold text-sc-ocean-blue shadow-md transition-all duration-300 hover:scale-105 hover:text-sc-chalk hover:shadow-pr-aquamarine/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        <next.RouteIcon size={18} stroke={2.5} aria-hidden="true" />
        <span>{next.label}</span>
        <IconArrowRight size={18} stroke={2.5} aria-hidden="true" />
      </Link>
    </div>
  );
}