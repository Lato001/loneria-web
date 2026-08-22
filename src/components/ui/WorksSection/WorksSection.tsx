import { useEffect, useMemo, useState } from "react";
import formasLineasOnduladas from "../../../assets/backgrounds/formas-lineas-onduladas.svg";
import { CategorySelect } from "../CategorySelect";
import { WorksCarousel } from "../WorksCarousel";
import { ImgCard } from "../Card";
import { SectionWrapper } from "../SectionWrapper";
import { NextPageCta } from "../NextPageCta";
import { Button } from "../Button";
import Masonry from "../Masonry/Masonry";
import type { Trabajo } from "../../../types/trabajo";
import { data } from "../../../mocks/data";
import type { AlbumImage } from "../../../mocks/types";
import { useWorksUrlState } from "./useWorksUrlState";
import {
  IconAnchor,
  IconBolt,
  IconDroplet,
  IconLifebuoy,
  IconLock,
  IconPackage,
  IconReplace,
  IconSailboat,
  IconShield,
  IconShieldCheck,
  IconSun,
  IconTag,
  IconTool,
  IconUmbrella,
  IconWind,
} from '@tabler/icons-react';
import type { Icon } from '@tabler/icons-react';

// Icon key (from data.ts `cualidades[].icono`) → Tabler icon component.
// Unknown keys fall back to IconTag.
const cualidadIconos: Record<string, Icon> = {
  IconAnchor,
  IconBolt,
  IconDroplet,
  IconLifebuoy,
  IconLock,
  IconPackage,
  IconReplace,
  IconSailboat,
  IconShield,
  IconShieldCheck,
  IconSun,
  IconTool,
  IconUmbrella,
  IconWind,
};
interface WorksSectionProps {
  /** imageKey → 480px thumbnail URL (see Works.tsx thumbMap). */
  thumbMap: Record<string, string>;
  /** imageKey → { w, h } build-time dimensions (see Works/imageManifest.json). */
  imageDims: Record<string, { w: number; h: number }>;
}

/** Summary length (words) for the mobile "Leer Más" toggle. */
const MOBILE_DESCRIPTION_SUMMARY_WORDS = 30;

/** Album images rendered per "Cargar más" batch. Tuneable. */
export const ALBUM_PAGE_SIZE = 24;

/** Live viewport check for mobile (<1024px) using matchMedia. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia("(min-width: 1024px)").matches);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsMobile(!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/** Truncates a text to the first `maxWords` words. */
function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
}

interface DescriptionTextProps {
  text: string;
  trabajoId: string;
}

/**
 * Mobile: shows a 60-word summary with a "Leer Más" button when the text is
 * longer. Desktop always shows the full text (side-by-side layout).
 */
function DescriptionText({ text, trabajoId }: DescriptionTextProps) {
  const isMobile = useIsMobile();
  const [expandedTrabajoId, setExpandedTrabajoId] = useState<string | null>(null);
  const isExpanded = expandedTrabajoId === trabajoId;
  const needsToggle = isMobile && text.trim().split(/\s+/).length > MOBILE_DESCRIPTION_SUMMARY_WORDS;

  if (!needsToggle || isExpanded) {
    return (
      <p className="mb-6 max-w-[95%] wrap-anywhere font-poppins text-base leading-relaxed text-justify text-sc-chalk md:text-lg">
        {text}
      </p>
    );
  }

  return (
    <>
      <p className="mb-6 max-w-[95%] wrap-anywhere font-poppins text-base leading-relaxed text-justify text-sc-chalk md:text-lg">
        {truncateToWords(text, MOBILE_DESCRIPTION_SUMMARY_WORDS)}
      </p>
      <button
        type="button"
        onClick={() => setExpandedTrabajoId(trabajoId)}
        className="mb-6 cursor-pointer font-poppins text-base font-semibold text-pr-aquamarine hover:underline focus-visible:outline-2 focus-visible:outline-pr-aquamarine"
      >
        Leer Más
      </button>
    </>
  );
}

export function WorksSection({ thumbMap, imageDims }: WorksSectionProps) {
  const showcaseId = "works-showcase";
  // Scroll target: the content grid (ImgCard + description), not the section top
  // — avoids landing too high and forcing the user to scroll back down a bit.
  const scrollTargetId = "works-showcase-content";

  const trabajos = data.worksPage.trabajos as Trabajo[];
  const availableCategorias = useMemo(
    () => [...new Set(trabajos.map((t) => t.categoria))].sort(),
    [trabajos],
  );

  const {
    selectedCategoria,
    selectedTrabajo,
    carouselImages,
    mainImageSrc,
    mainImageAlt,
    handleCategoriaChange,
    handleAlbumClick,
    handleThumbSelect,
  } = useWorksUrlState({ trabajos, availableCategorias, scrollTargetId, thumbMap });

  // Album items derived from trabajos, shuffled once at mount (lazy initializer —
  // keeps Math.random() out of the render path for React Compiler purity).
  const [albumItems] = useState<AlbumImage[]>(() => {
    const items: AlbumImage[] = trabajos.flatMap((t) =>
      t.imagenes.map((img: string, i: number) => ({
        id: `${t.id}-${i}`,
        img: thumbMap[img],
        url: "",
        alt: t.titulo,
        title: t.titulo,
        trabajoId: t.id,
        categoria: t.categoria,
        imageIndex: i,
      })),
    );
    // Fisher-Yates shuffle for stable random order
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Masonry items carry the resolved URL (`img`), so key the build-time
  // dimensions by URL (derived once from the thumbnail map). Thumbnails and
  // full-res share the same aspect ratio, so the manifest dims apply.
  const imageDimsByUrl = useMemo(() => {
    const byUrl: Record<string, { w: number; h: number }> = {};
    for (const [key, dims] of Object.entries(imageDims)) {
      const thumbUrl = thumbMap[key];
      if (thumbUrl) byUrl[thumbUrl] = dims;
    }
    return byUrl;
  }, [thumbMap, imageDims]);

  // Album pagination: only `visibleCount` items are passed to the Masonry.
  // The shuffle above runs ONCE on the full array; pagination only slices it.
  const [visibleCount, setVisibleCount] = useState(ALBUM_PAGE_SIZE);
  const visibleAlbumItems = useMemo(
    () => albumItems.slice(0, visibleCount),
    [albumItems, visibleCount],
  );
  const hasMoreAlbumItems = visibleCount < albumItems.length;

  return (
    <>
      {/* Showcase Section */}
<SectionWrapper
        id={showcaseId}
        eyebrow="Trabajos"
        title="Nuestros Trabajos"
        headingLevel="h1"
        containerClassName="mx-auto max-w-[1400px] px-6 lg:px-10 "
        className="!pb-10 bg-gradient-to-b from-pr-aquamarine/20 to-sc-ocean-blue"
      >
        <CategorySelect
          value={selectedCategoria}
          options={availableCategorias}
          onChange={handleCategoriaChange}
        />
        <div className="rounded-3xl bg-gradient-to-r from-sc-ocean-blue/30 to-pr-hero-blue">

        
        <div className="mt-10 grid gap-8 scroll-mt-24 lg:grid-cols-[40%_60%]" id={scrollTargetId}>
          {/* ImgCard - Left column */}
          <div className="flex min-w-0 items-start justify-center rounded-3xl pl-[5px] pt-[5px] pb-[5px] lg:justify-start">
            <ImgCard
              src={mainImageSrc}
              alt={mainImageAlt}
              imageClassName="w-full max-w-md aspect-[4/3]"
              className="!aspect-[4/3] md:!aspect-[9/16] max-w-[450px] max-h-[350px] md:max-h-[700px]"
              loading="eager"
            />
          </div>

          {/* Description - Right column */}
          <div className="flex min-w-0 flex-col justify-start">
            <div className="w-full min-w-0 px-8 py-8 lg:px-12">

            {selectedTrabajo && (
              <>
                <span className="inline-block self-start rounded-full py-4 font-poppins text-xl font-semibolditalic text-pr-aquamarine ">
                  <div className="flex items-center justify-around">
                  <IconTag stroke={2} className="mr-1.5" />
                  {selectedTrabajo.categoria.charAt(0).toUpperCase() + selectedTrabajo.categoria.slice(1).replace(/-/g, " ")}
                  </div>
                </span>
                <h2 className="my-4 wrap-anywhere font-poppins font-bold text-2xl text-sc-chalk md:text-3xl">
                  {selectedTrabajo.titulo}
                </h2>
                <DescriptionText text={selectedTrabajo.descripcion} trabajoId={selectedTrabajo.id} />
                {selectedTrabajo.cualidades && selectedTrabajo.cualidades.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {selectedTrabajo.cualidades.map((c) => {
                      const IconCualidad = cualidadIconos[c.icono] ?? IconTag;
                      return (
                        <li
                          key={c.texto}
                          className="inline-flex items-center gap-1.5 rounded-full bg-sc-sky-blue/10 px-3 py-1.5 font-poppins text-sm font-semibold text-pr-aquamarine"
                        >
                          <IconCualidad stroke={2} size={16} aria-hidden="true" />
                          {c.texto}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {/* WorksCarousel */}
        {carouselImages.length >= 2 && (
          <WorksCarousel images={carouselImages} onThumbSelect={handleThumbSelect} />
        )}
              </>
            )}
            </div>
          </div>
        </div>
        </div>
        
      </SectionWrapper>

{/* Album Section */}
      <SectionWrapper
      eyebrow="Album de fotos"
      titlesAlign="center"
        title="Trabajos destacados"
        headingLevel="h2"
        fullWidth
        className="!pt-10"
        backgroundImage={formasLineasOnduladas}
      >
        <div className="mx-auto w-full max-w-[1800px] px-2 rounded-3xl lg:px-0 min-[2200px]:max-w-[2200px]">
        <Masonry
          items={visibleAlbumItems}
          imageDims={imageDimsByUrl}
          variant="uniform"
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          scaleOnHover
          hoverScale={0.95}
          colorShiftOnHover={true}
          footer={
            <div className="pb-20">
              {hasMoreAlbumItems && (
                <div className="flex flex-col items-center gap-4 pt-12">
                  <p className="font-poppins text-lg text-sc-chalk/70">
                    Mostrando {Math.min(visibleCount, albumItems.length)} de {albumItems.length}
                  </p>
                  <Button
                    className="text-lg font-semibold"
                    variant="danger"
                    size="lg"
                    onClick={() =>
                      setVisibleCount((prev) => Math.min(prev + ALBUM_PAGE_SIZE, albumItems.length))
                    }
                  >
                    Cargar más
                  </Button>
                </div>
              )}
              <NextPageCta className="pt-2" />
            </div>
          }
          onItemClick={(item) => handleAlbumClick(item as AlbumImage)}
        />
        </div>
      </SectionWrapper>
    </>
  );
}