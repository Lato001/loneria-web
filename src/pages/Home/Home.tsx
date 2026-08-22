import { Hero } from "../../components/layout";
import {
  Accordion,
  LinkButton,
  SectionWrapper,
  SplitCards,
  NextPageCta,
} from "../../components/ui";
import Masonry from "../../components/ui/Masonry/Masonry";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import type { MasonryItem } from "../../mocks/types";
import { data } from "../../mocks/data";
import { PATHS } from "../../routes/routes";
// ── Nuevos imports para el masonry de la home ──────────────────────────────
import capota01 from "../../assets/img/works/capota/thumbs/capota-01.webp";
import carpa01 from "../../assets/img/works/carpa/thumbs/carpa-01.webp";
import cerramiento01 from "../../assets/img/works/cerramiento/thumbs/cerramiento-01.webp";
import toneau01 from "../../assets/img/works/toneau/thumbs/toneau-01.webp";

// ─── SplitCards images (direct imports) ─────────────────────────────────
import productosCard from "../../assets/img/products/tomas-de-aire/thumbs/toma-boat-vent-3.webp";

//MAPEO DE MASONRY
const masonryImageMap: Record<string, string> = {
  "capota-01": capota01,
  "carpa-01": carpa01,
  "cerramiento-01": cerramiento01,
  "toneau-01": toneau01,
};

const splitCardsImageMap: Record<string, string> = {
  "productos-card": productosCard,
  "trabajos-card": carpa01,
};

const homeMasonryItems: MasonryItem[] = data.home.masonryItems.map((item) => ({
  ...item,
  img: masonryImageMap[item.img] ?? (() => {
    if (import.meta.env.DEV) console.warn(`[masonry] imagen no encontrada para key: "${item.img}"`);
    return "";
  })(),
  eyebrow: item.title ?? "Trabajos a medida",
  chips: ["A medida", "Lona reforzada"],
}));

export function Home() {
  useDocumentMeta({
    title: undefined,
    path: "/",
  });

  return (
    <>
      <Hero
        eyebrow={data.home.hero.eyebrow}
        titlePrefix={data.home.hero.titlePrefix}
        titleHighlight={data.home.hero.titleHighlight}
        description={data.home.hero.description}
        primaryCta={data.home.hero.primaryCta}
        secondaryCta={data.home.hero.secondaryCta}
        videos={data.home.hero.videos}
      />
      <div className=" bg-gradient-to-br from-sc-ocean-blue/20 to-pr-aquamarine/20">

        <SectionWrapper

        className="bg-gradient-to-b from-sc-ocean-blue/20 to-sc-sky-blue/35"
          titlesAlign={data.home.sections.whatWeOffer.titlesAlign}
          eyebrow={data.home.sections.whatWeOffer.eyebrow}
          title={data.home.sections.whatWeOffer.title}
          >
          <SplitCards
            items={data.home.splitCards}
            imageMap={splitCardsImageMap}
            />
        </SectionWrapper>
        <SectionWrapper
        className="bg-gradient-to-b from-sc-sky-blue/35 to-sc-ocean-blue"
        
          titlesAlign={data.home.sections.aboutUs.titlesAlign}
          eyebrow={data.home.sections.aboutUs.eyebrow}
          title={data.home.sections.aboutUs.title}
          >
          <div className="pb-10">
            <Masonry
              items={homeMasonryItems}
              variant="mosaic"
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              scaleOnHover
              hoverScale={0.95}
              />
          </div>
          <div className="flex justify-center">
            <LinkButton
              type="Redirect"
              text="Ver mas trabajos..."
              theme="light"
              path={PATHS.WORKS}
              className="mt-15 xl:hidden "
            />
          </div>
        </SectionWrapper>
      
      <SectionWrapper
      className="bg-gradient-to-b from-sc-ocean-blue/20 to-sc-sky-blue/35"
        titlesAlign={data.home.sections.testimonials.titlesAlign}
        eyebrow={data.home.sections.testimonials.eyebrow}
        title={data.home.sections.testimonials.title}
        >
        <SplitReviews></SplitReviews>
        <div className=" mt-10 pt-10 flex justify-center">
          <LinkButton
            type="Google"
            text="Ver Reseñas"
            theme="light"
            url="https://maps.app.goo.gl/5yJprtv3uSdtv13M7"
            />
        </div>
      </SectionWrapper>
      <SectionWrapper
        className="bg-gradient-to-b from-sc-sky-blue/35 to-sc-ocean-blue"
        theme={data.home.sections.faq.theme}
        titlesAlign={data.home.sections.faq.titlesAlign}
        eyebrow={data.home.sections.faq.eyebrow}
        title={data.home.sections.faq.title}
        >
        <Accordion items={data.home.faqs} />
        <NextPageCta className="pt-15" />
      </SectionWrapper>
      </div>

    </>
  );
}
