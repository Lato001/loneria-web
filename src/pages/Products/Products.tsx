import { useEffect, useMemo, useState } from "react";
import {
  IconX,
  IconBulb,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useSessionSelection } from "../../hooks/useSessionSelection";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useProductCarousel } from "../../components/ui/ProductCarousel/useProductCarousel";
import { buildWhatsAppUrl } from "./whatsappUrl";
import { IconBrandWhatsapp } from '@tabler/icons-react';
import {
  SectionHero,
  SectionTabs,
  ActionBar,
  Modal,
  Button,
  ProductCarousel,
  NextPageCta,
} from "../../components/ui";
import type { Product } from "../../components/ui/ProductCarousel/ProductCarousel.types";
import type { Tab } from "../../components/ui/SectionTabs/SectionTabs.types";
import type { ProductCategoryData } from "../../mocks/types";
import { data } from "../../mocks/data";
import { ImgCard } from "../../components";
import MediaPlayer from "../../components/ui/MediaPlayer/MediaPlayer";

const STORAGE_KEY = "mono:quote-cart";

// ─── Product images (auto-discovered via Vite glob) ─────────────────────
// 480px thumbnails only: the full-res originals are never loaded at runtime
// (the carousel, quote list and big ImgCard all render at ≤480px). The key
// comes from the thumb filename (baseName without extension).
const thumbModules = import.meta.glob("../../assets/img/products/**/thumbs/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const productsThumbMap: Record<string, string> = {};
for (const [path, url] of Object.entries(thumbModules)) {
  const key = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
  productsThumbMap[key] = url;
}

// ─── Derived data ────────────────────────────────────────────────────────

/** Converts ProductData (imageKey) → Product (imageSrc) for the carousel. */
function toProduct(p: {
  id: string;
  title: string;
  description: string;
  imageKey: string;
}): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    imageSrc: productsThumbMap[p.imageKey],
  };
}

// The data literal's inferred type drops optional fields, so widen to the
// contract to read `videoUrl?: string` safely.
const categoryData = data.products.categories as ProductCategoryData[];

const categories = categoryData.map((cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  imageKey: cat.imageKey,
  videoUrl: cat.videoUrl,
  // 480px thumb of the category's first product: the big ImgCard renders at
  // max ~480px wide (xl:max-w-120), so the thumbnail is enough.
  mainImageSrc: cat.products[0]
    ? productsThumbMap[cat.products[0].imageKey]
    : undefined,
  products: cat.products.map(toProduct),
}));

const tabs: Tab[] = categories.map((c) => ({ id: c.id, name: c.name }));

/** Reads `?categoria=..` from the URL and validates it against the catalog. */
function resolveUrlState(): {
  activeCategoryId: string;
  rewriteTo?: string;
} {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("categoria");
  const validCat = categories.find((c) => c.id === catParam);

  if (!validCat) {
    return {
      activeCategoryId: categories[0].id,
      // Invalid params only: reset to the bare path. Empty URL stays untouched.
      rewriteTo: params.toString() ? window.location.pathname : undefined,
    };
  }

  return { activeCategoryId: validCat.id };
}

function CotizacionModalContent({
  products,
  onRemove,
  whatsappHref,
  isWhatsAppDisabled,
  whatsappDisabledReason,
}: {
  products: Product[];
  onRemove: (id: string) => void;
  whatsappHref: string;
  isWhatsAppDisabled: boolean;
  whatsappDisabledReason?: string;
}) {
  return (
    <div className="font-poppins flex min-h-0 flex-1 flex-col gap-3">
      {products.length === 0 ? (
        <p className="text-base text-sc-ocean-blue/70">
          {data.ui.noProductsSelected}
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md border-1 border-dashed border-pr-hero-blue px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-3">
                <img
                  src={p.imageSrc}
                  alt={p.title}
                  className="size-14 shrink-0 rounded object-cover"
                />
                <span className="truncate text-base font-poppins font-bold text-sc-ocean-blue">
                  {p.title}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Quitar ${p.title}`}
                className="rounded-full p-1 text-sc-chalk bg-sc-ocean-blue ring-2 ring-pr-aquamarine/30 transition-colors hover:bg-pr-aquamarine hover:text-sc-ocean-blue  hover:ring-2 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
              >
                <IconX className="h-5 w-5" stroke={3} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isWhatsAppDisabled ? (
        <p
          role="note"
          className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900"
        >
          {whatsappDisabledReason ?? data.ui.whatsappDisabledReason}
        </p>
      ) : (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sc-sky-blue px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-pr-hero-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          <IconBrandWhatsapp stroke={2} />
          {data.ui.consultWhatsApp}
        </a>
      )}
    </div>
  );
}

export function Products() {
  useDocumentMeta({
    title: "Productos para tu embarcación",
    description:
      "Broches, correas, omegas, hilos y herrajes para capotas. Repuestos y accesorios náuticos en Tigre.",
    path: "/productos",
  });

  const { selected, isSelected, toggle, remove, clear, count } =
    useSessionSelection(STORAGE_KEY);
  const { scrollRef, prev, next, canPrev, canNext, recompute } =
    useProductCarousel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [initialUrl] = useState(resolveUrlState);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    initialUrl.activeCategoryId,
  );
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [prevSelectedSize, setPrevSelectedSize] = useState(selected.size);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const selectedProducts = useMemo<Product[]>(
    () =>
      Array.from(selected).flatMap((id) => {
        for (const cat of categories) {
          const p = cat.products.find((x) => x.id === id);
          if (p) return [p];
        }
        return [];
      }),
    [selected],
  );

  const selectedCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const catCount = cat.products.filter((p) => selected.has(p.id)).length;
      if (catCount > 0) counts[cat.id] = catCount;
    }
    return counts;
  }, [selected]);

  const whatsappResult = useMemo(
    () =>
      buildWhatsAppUrl(
        selectedProducts,
        import.meta.env.VITE_WHATSAPP_URL as string,
        window.location.href,
      ),
    [selectedProducts],
  );

  // Reset the product carousel scroll to the first item whenever the category
  // changes (after the new products have rendered).
  useEffect(() => {
    scrollRef.current?.scrollTo?.({ left: 0 });
    recompute();
  }, [activeCategoryId, scrollRef, recompute]);

  // URL normalization on mount: invalid-param cleanup, once.
  useEffect(() => {
    if (initialUrl.rewriteTo) {
      history.replaceState(null, "", initialUrl.rewriteTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only rewrite
  }, []);

  const handleTabSelect = (id: string) => {
    setActiveCategoryId(id);
    setShowMobileInfo(false);
    history.replaceState(null, "", `?${new URLSearchParams({ categoria: id })}`);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Auto-close: if the selection empties while the quote modal is open (the
  // user removed the last item inside the modal), close it for real. Without
  // this sync, `isModalOpen` would stay true and the modal would reopen as
  // soon as a new product is selected afterwards.
  if (prevSelectedSize !== selected.size) {
    setPrevSelectedSize(selected.size);
    if (isModalOpen && selected.size === 0) {
      setIsModalOpen(false);
    }
  }

  const handleOpenClearModal = () => setIsClearModalOpen(true);
  const handleCloseClearModal = () => setIsClearModalOpen(false);
  const handleConfirmClear = () => {
    clear();
    setIsClearModalOpen(false);
  };

  return (
    <>
      <SectionHero
        title={data.ui.catalogHeroTitle}
        description={data.ui.catalogHeroDescription}
      />

      <div className="bg-sc-chalk">
        <div id="tabs">
          <SectionTabs
            categories={tabs}
            activeId={activeCategoryId}
            onSelect={handleTabSelect}
            selectedCounts={selectedCounts}
          />

          {activeCategory && (
            <div className="px-6 pt-10 pb-12 xl:mx-auto xl:max-w-400">
              <div
                data-testid="catalog-layout"
                className="flex flex-col gap-8 xl:grid xl:grid-cols-12 xl:gap-8 xl:h-176"
              >
                {/* COLUMNA IZQUIERDA (Tarjeta de Imagen) */}
                <div className="flex shrink-0 justify-center xl:col-span-5 xl:h-full xl:items-center">
                  <ImgCard
                    src={
                      activeCategory.mainImageSrc ??
                      activeCategory.products[0]?.imageSrc
                    }
                    alt={activeCategory.name}
                    className="xl:max-w-120 xl:max-h-200"
                    actionButton={
                      <button
                        type="button"
                        onClick={() => setShowMobileInfo((prev) => !prev)}
                        className="flex size-12 items-center justify-center rounded-full border border-pr-aquamarine/50 bg-pr-aquamarine text-white brightness-90 shadow-lg ring-2 ring-pr-aquamarine/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-pr-aquamarine/80  hover:ring-pr-aquamarine/70 active:scale-95 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
                        aria-label={
                          showMobileInfo
                            ? "Cerrar información"
                            : "Ver información"
                        }
                      >
                        {showMobileInfo ? (
                          <IconX  size={30} stroke={2.5} />
                        ) : (
                          <IconBulb size={30} stroke={2} />
                        )}
                      </button>
                    }
                    overlay={
                      showMobileInfo ? (
                        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black/5 p-6 backdrop-brightness-70 backdrop-blur-sm card:p-10">
                          <div className="flex w-full flex-col items-center justify-center gap-3">
                            <div className="w-full max-w-[85%] rounded-full border-2 border-sc-ocean-blue bg-sc-ocean-blue px-5 py-2.5 shadow-md">
                              <h3 className="text-center font-poppins font-extrabold text-lg uppercase tracking-wide text-white">
                                MONO TIP
                              </h3>
                            </div>
                            <div className="w-full max-w-[85%] rounded-2xl border-2 border-sc-ocean-blue/10 bg-sc-sky-blue px-4 py-4 shadow-md">
                              <p className="text-center font-poppins font-semibold text-sm leading-relaxed text-white">
                                {activeCategory.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : undefined
                    }
                  />
                </div>

                {/* COLUMNA DERECHA (Video + Productos) */}
                <div className="flex w-full min-w-0 flex-col-reverse gap-6 xl:h-full xl:flex-col xl:col-span-7 xl:gap-8">
                  {/* Video: 16:9 centrado en la mitad superior */}
                  <div className="w-full min-w-0 xl:flex xl:flex-1 xl:min-h-0 xl:items-center xl:justify-center">
                    <div className="flex w-full aspect-video xl:h-full xl:w-auto xl:max-w-full xl:mt-16">
                      {activeCategory.videoUrl ? (
                        <MediaPlayer
                          key={activeCategory.id}
                          src={activeCategory.videoUrl}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sc-ocean-blue/5 font-poppins text-sm text-sc-ocean-blue/50">
                          Video próximamente
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Carousel: mitad inferior */}
                  <div className="relative flex w-full min-w-0 flex-1 flex-col xl:min-h-0">
                    <button
                      type="button"
                      aria-label={data.ui.prevLabel}
                      onClick={prev}
                      disabled={!canPrev}
                      className="group absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-sc-ocean-blue p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-pr-aquamarine/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sc-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine xl:block hover:cursor-pointer"
                    >
                      <IconChevronLeft
                        stroke={4}
                        className="h-5 w-5 text-sc-chalk transition-colors group-hover:text-sc-ocean-blue"
                      />
                    </button>
                    <div className="xl:mx-auto  xl:h-full xl:w-150 xl:max-w-full">
                      <ProductCarousel
                        id={activeCategory.id}
                        items={activeCategory.products}
                        ariaLabel={activeCategory.name}
                        isSelected={isSelected}
                        onToggle={toggle}
                        scrollRef={scrollRef}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={data.ui.nextLabel}
                      onClick={next}
                      disabled={!canNext}
                      className="group absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-sc-ocean-blue p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-pr-aquamarine/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sc-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine xl:block hover:cursor-pointer"
                    >
                      <IconChevronRight
                        stroke={4}
                        className="h-5 w-5 text-sc-chalk transition-colors group-hover:text-sc-ocean-blue"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <NextPageCta className="pt-15" />
            </div>
          )}
        </div>
      </div>

      <ActionBar
        selectedCount={count}
        onPresupuestar={handleOpenModal}
        onClear={handleOpenClearModal}
        presupuestarDisabled={count === 0}
      />

      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        title={data.ui.quoteModal.title}
        description={data.ui.quoteModal.description}
      >
        <CotizacionModalContent
          products={selectedProducts}
          onRemove={remove}
          whatsappHref={whatsappResult.href}
          isWhatsAppDisabled={whatsappResult.isTooLong}
          whatsappDisabledReason={data.ui.whatsappDisabledReason}
        />
      </Modal>

      <Modal
        open={isClearModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseClearModal();
        }}
        title={data.ui.clearModal.title}
        description={data.ui.clearModal.description}
        variant="centered"
        size="sm"
      >
        <div className="font-poppins flex flex-col gap-4">
          <p className="text-base font-medium text-sc-ocean-blue">
            {data.ui.clearConfirmation}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
              size="sm"
              className="!text-base"
              onClick={handleCloseClearModal}
              ariaLabel={data.ui.cancel}
            >
              {data.ui.cancel}
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="!text-base"
              onClick={handleConfirmClear}
              ariaLabel={data.ui.clearListAriaLabel}
            >
              {data.ui.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
