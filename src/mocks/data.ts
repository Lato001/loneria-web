/**
 * MOCK DATA — SINGLE SOURCE OF TRUTH
 * ──────────────────────────────────────────────────────────────────
 *  ALL page content (copy, navigation, products, brands, FAQ, UI labels)
 *  lives here. Components import `data` and render. No API, no fetch, no
 *  context — the whole site is a build-time static bundle.
 *
 *  MIGRATION TO A REAL DATABASE (4 steps, NOT in this change):
 *
 *    1. Wrap `data` in an async fetcher:
 *         export async function fetchData(): Promise<typeof data> { ... }
 *
 *    2. Add a `DataProvider` context populated on app mount:
 *         const ctx = useAppData();  // returns `data` once loaded
 *
 *    3. Swap consumer imports:
 *         import { data } from "../../mocks/data";  // BEFORE
 *         const { home } = useAppData();             // AFTER
 *
 *    4. Types and component contracts stay byte-identical — only the
 *       data source and the import line change.
 *
 *  IMAGE & ICON DECOUPLING:
 *    • Images are stored as `imageKey: string` in data. Each consuming
 *      page maintains a `Record<imageKey, string>` map co-located with
 *      the asset imports. DB migration = swap the map for CDN URLs.
 *    • Icons are stored as `platform: SocialPlatform` (Footer) or
 *      `iconKey: ContactIconKey` strings, resolved via a local map
 *      in Footer.tsx.
 */

import type { Review } from "../types/review";
// Unused today (AboutUs page reads the gallery keys, not `image`), but kept
// light: 480px thumb instead of the 986 KB full-res.
import taller02 from "../assets/img/about/thumbs/taller-02.webp";
import type {
  AboutUsContent,
  AboutUsSection,
  BrandData,
  FaqItem,
  FooterNav,
  GlobalData,
  HeroData,
  NavLink,
  ProductCategoryData,
  ReviewsSection,
  Section,
  SectionsGroup,
  WorksPageData,
  SplitCardData,
  UICopy,
  MasonryItem,
  Trabajo,
} from "./types";

// ─── Works page — Trabajos data ────────────────────────────────────────────
const trabajos: Trabajo[] = [
  // Toneau
  {
    id: "trab-toneau-1",
    categoria: "toneau",
    titulo: "Toneau para pick-up Ford Ranger",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["toneau-01", "toneau-02", "toneau-03", "toneau-04", "toneau-05", "toneau-06", "toneau-07", "toneau-08", "toneau-09", "toneau-10", "toneau-11", "toneau-12", "toneau-13", "toneau-14", "toneau-15", "toneau-16", "toneau-17"],
    destacado: true,
    cualidades: [
      { icono: "IconDroplet", texto: "Impermeable" },
      { icono: "IconSun", texto: "Resistente a rayos UV" },
      { icono: "IconReplace", texto: "Apertura enrollable" },
      { icono: "IconShieldCheck", texto: "Aluminio anodizado" },
    ],
  },
  // Cubrevidrios
  {
    id: "trab-cubrevidrios-1",
    categoria: "cubrevidrios",
    titulo: "Cubrevidrios para lancha cabinada 22 pies",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["cubrevidrio-01", "cubrevidrio-02", "cubrevidrio-03", "cubrevidrio-04", "cubrevidrio-05", "cubrevidrio-06", "cubrevidrio-07", "cubrevidrio-08", "cubrevidrio-09", "cubrevidrio-10", "cubrevidrio-11"],
    destacado: true,
    cualidades: [
      { icono: "IconSun", texto: "Lona Sunbrella Pacific Blue" },
      { icono: "IconShield", texto: "Protección total" },
      { icono: "IconBolt", texto: "Fijación con broches" },
      { icono: "IconPackage", texto: "Bolsillo de guardado" },
    ],
  },
  // Cubre Fly
  {
    id: "trab-cubre-fly-1",
    categoria: "cubre-fly",
    titulo: "Cubre Flybridge para yate 38 pies",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["cubre-fly-01", "cubre-fly-02", "cubre-fly-03", "cubre-fly-04", "cubre-fly-05", "cubre-fly-06", "cubre-fly-07"],
    destacado: true,
  },
  // Cerramientos
  {
    id: "trab-cerramientos-1",
    categoria: "cerramientos",
    titulo: "Cerramiento lateral para embarcación deportiva",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["cerramiento-01", "cerramiento-02", "cerramiento-03"],
    destacado: true,
  },
  {
    id: "trab-cerramientos-2",
    categoria: "cerramientos",
    titulo: "Cerramiento frontal con puerta enrollable",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["cerramiento-04", "cerramiento-05"],
  },
  // Carpas (default category - must have at least one)
  {
    id: "trab-carpas-1",
    categoria: "carpas",
    titulo: "Carpa toldo para embarcación neumática",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["carpa-01", "carpa-02", "carpa-03", "carpa-04", "carpa-05", "carpa-06", "carpa-07"],
    destacado: true,
    cualidades: [
      { icono: "IconUmbrella", texto: "Lona Sunbrella Captain Navy" },
      { icono: "IconAnchor", texto: "Acero inoxidable 316L" },
      { icono: "IconBolt", texto: "Montaje rápido sin herramientas" },
      { icono: "IconPackage", texto: "Funda de guardado incluida" },
    ],
  },
  {
    id: "trab-carpas-2",
    categoria: "carpas",
    titulo: "Carpa de proa para lancha abierta",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["carpa-08", "carpa-10", "carpa-11", "carpa-12", "carpa-13", "carpa-14", "carpa-15"],
  },
  // Capotas
  {
    id: "trab-capotas-1",
    categoria: "capotas",
    titulo: "Capota rígida para consola central 24 pies",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["capota-01", "capota-02", "capota-03", "capota-04", "capota-05", "capota-06", "capota-07"],
    destacado: true,
    cualidades: [
      { icono: "IconTool", texto: "Estructura de aluminio" },
      { icono: "IconShield", texto: "Policarbonato ahumado" },
      { icono: "IconLock", texto: "Cerradura de seguridad" },
      { icono: "IconWind", texto: "Ventilación ajustable" },
    ],
  },
  {
    id: "trab-capotas-2",
    categoria: "capotas",
    titulo: "Capota de lona para embarcación clásica",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["capota-08", "capota-09", "capota-10", "capota-11", "capota-12", "capota-13", "capota-14"],
  },
  
  // Extra
  {
    id: "trab-extra-1",
    categoria: "extra",
    titulo: "Cubre motor fuera de borda 150HP",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["extra-01", "extra-02"],
    destacado: true,
  },
  {
    id: "trab-extra-2",
    categoria: "extra",
    titulo: "Bolsa estanca para equipamiento de cubierta",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["extra-03", "extra-04"],
  },
  {
    id: "trab-extra-3",
    categoria: "extra",
    titulo: "Protector de proa para amarre",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["extra-05", "extra-06"],
  },
  {
    id: "trab-extra-4",
    categoria: "extra",
    titulo: "Funda de timón para embarcación a vela",
    descripcion:
      "Carpeta de bitácora en cuero náutico tratado con costuras a contraste. Interior con fundas para cartas, libretas e instrumentos. Cierre magnético oculto. Cuenta con bolsillo frontal para documentos de la embarcación, anillas para lápiz y una banda elástica que sujeta la página abierta durante la navegación. La tapa queda rígida para apoyar al escribir en cubierta, con esquinas reforzadas y canto en lona resistente a la abrasión. Disponible en varios tamaños y colores de interior, con grabado personalizado en la portada.",
    imagenes: ["extra-07", "extra-08"],
  },
];

// ─── Canonical data ──────────────────────────────────────────────────────

const reviews = [
  {
    id: "r1",
    title: "Excelente Trabajo",
    author: "Enrique Gómez",
    stars: 5,
    description: "Trabajos rápidos y acorde con precios, recomendados!",
  },
  {
    id: "r2",
    title: "Excelente Atencion y Servicio",
    author: "German Villanueva",
    stars: 5,
    description:
      "Excelente atención y servicio. Trabajos en tiempo y forma con la mejor calidad",
  },
  {
    id: "r3",
    title: "En Tiempo y Forma",
    author: "Lautaro Couceiro",
    stars: 5,
    description:
      "Excelente. Cumplió en tiempo y forma, la lona le queda como un guante a mi tracker. Muy recomendable.",
  },
] satisfies Review[];

const faqs = [
  {
    id: "faq1",
    category: "trabajos",
    q: "¿Puedo llevar mi propio diseño o tienen catálogo?",
    a: "Las dos cosas. Trabajamos a medida desde un diseño propio, una idea, una foto o una necesidad específica. Si preferís ver opciones, tenemos catálogo de modelos probados que podemos adaptar a tus medidas.",
  },
  {
    id: "faq2",
    category: "tiempos",
    q: "¿Cuánto tardamos en hacer tu lona?",
    a: "Por lo general demoramos unos 15 dias aprox. desde el pago del adelanto. Ésto puede variar según las dimensiones del trabajo!",
  },
  {
    id: "faq3",
    category: "servicios",
    q: "¿Ofrecen garantía sobre sus trabajos?",
    a: "Sí. Todos nuestros trabajos cuentan con garantía de confección. La cobertura específica varía según el material y el tipo de producto, pero en general cubre defectos de fabricación y costuras.",
  },
  {
    id: "faq4",
    category: "insumos",
    q: "¿Qué tipo de materiales utilizan?",
    a: "Trabajamos con lonas técnicas náuticas, vinilos de primera calidad y textiles de alta performance como Sunbrella y Sailrite. Cada material se elige según el uso final y la exposición al sol, sal y viento.",
  },
] satisfies FaqItem[];

const reviewsSection: ReviewsSection = {
  id: "reviews",
  kind: "reviews",
  eyebrow: "Lo que dicen los clientes",
  title: "Reseñas",
};

const aboutUsSection: AboutUsSection = {
  id: "aboutus",
  kind: "aboutus",
  eyebrow: "Nuestro Taller",
  title: "Oficio de lonería - Trabajo Artesanal",
  content: 
    "En nuestro taller combinamos tradición y técnica para crear lonas que resisten el mar. Cada pieza es confeccionada a mano con materiales de primera calidad, garantizando durabilidad y protección en las condiciones más exigentes.",
  image: taller02,
  imageAlt: "Taller de El Mono",
  gallery: [
    { imageKey: "taller-01", alt: "Primer plano de herramientas de medición" },
    { imageKey: "taller-02", alt: "Proceso de corte de tela" },
    { imageKey: "taller-03", alt: "Máquina de coser industrial" },
    { imageKey: "taller-04", alt: "Resultado final instalado" },
  ],
  highlights: [
    { label: "Años de oficio", value: 20 },
    { label: "Proyectos entregados", value: 500 },
    { label: "Clientes satisfechos", value: 300 },
  ],
  cta: { text: "Nuestros Trabajos", href: "/trabajos" },
};

// ─── Exported data object ────────────────────────────────────────────────

export const data = {
  // ─── Global brand ────────────────────────────────────────────────────
  global: {
    brandName: "El Mono",
    brandFullName: "El Mono Lonería Naval",
    brandLogoAlt: "El Mono — Lonería Naval",
  } satisfies GlobalData,

  // ─── UI copy (buttons, modals, aria-labels, empty states) ────────────
  ui: {
    ctaContactDesktop: "Pedi tu Presupuesto",
    ctaContactMobile: "Cotizar",
    catalogHeroTitle: "Nuestros productos",
    catalogHeroDescription:
      "Explorá nuestra selección de artículos náuticos: broches, caballetes, cierres e hilos de la más alta calidad para tu embarcación.",
    worksHeroTitle: "Nuestros servicios",
    worksHeroDescription:
      "TODO: replace with real content — descripción general de los servicios que ofrece El Mono (lonas, capotas, cerramientos, etc.).",
    worksCategoriesLabel: "Categorías de servicios",
    consultWhatsApp: "Consultar por WhatsApp",
    clearList: "Vaciar lista",
    keepBrowsing: "Seguir viendo",
    cancel: "Cancelar",
    delete: "Borrar",
    quoteModal: {
      title: "Cotizar productos",
      description: "Te llevamos a WhatsApp con los productos pre-seleccionados.",
    },
    clearModal: {
      title: "Borrar lista",
      description: "Vas a eliminar todos los productos seleccionados.",
    },
    clearConfirmation:
      "¿Estás seguro que querés borrar toda la lista de productos seleccionados? Esta acción no se puede deshacer.",
    whatsappDisabledReason:
      "El mensaje es demasiado largo; contactanos por WhatsApp directamente.",
    noProductsSelected: "No hay productos seleccionados.",
    selectedLabel: "Seleccionado",
    closeLabel: "Cerrar",
    prevLabel: "Anterior",
    nextLabel: "Siguiente",
    goToProductLabel: "Ir a producto",
    goToVideoLabel: "Ir a video",
    categoriesLabel: "Categorías de productos",
    contactWhatsAppLabel: "Contactar por WhatsApp",
    selectedCountLabel: "productos seleccionados",
    quoteCartLabel: "Presupuestar productos seleccionados",
    clearListLabel: "Borrar lista de productos seleccionados",
    quoteLabel: "Presupuestar",
    vaciarButton: "Vaciar",
    vaciarSelectionAriaLabel: "Vaciar selección",
    clearListAriaLabel: "Borrar lista",
    whatsappGreeting:
      "Hola! Me interesa presupuestar los siguientes productos:",
    contactSectionTitle: "Contacto",
    actionBarLabel: "Acciones del presupuesto",
  } satisfies UICopy,

  // ─── Navigation ──────────────────────────────────────────────────────
  nav: {
    header: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
      { label: "Trabajos", href: "/trabajos" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "FAQ", href: "/faq" },
      { label: "Contacto", href: "/contacto" },
    ] satisfies NavLink[],
    footer: {
      groups: [
        {
          title: "Servicios",
          links: [
            { label: "Lonas a Medida", href: "/trabajos" },
            { label: "Capotas para Embarcaciones", href: "/trabajos" },
            { label: "Cubreautos y Fundas", href: "/trabajos" },
          ],
        },
        {
          title: "Productos",
          links: [{ label: "Catálogo", href: "/productos" }],
        },
        {
          title: "Nosotros",
          links: [
            { label: "Sobre el Taller", href: "/nosotros" },
            { label: "Equipo", href: "/nosotros" },
          ],
        },
        {
          title: "Ayuda",
          links: [
            { label: "FAQ", href: "/faq" },
            { label: "Contacto", href: "/contacto" },
          ],
        },
      ],
      social: [
        { platform: "Facebook", href: "https://www.facebook.com/profile.php?id=100071098357153" },
        { platform: "Instagram", href: "https://www.instagram.com/lonerianavalelmono/" },
      ],
      contact: [
        {
          label: "Teléfono",
          value: "+54 9 11 6990-6255",
          href: "tel:+5491169906255",
          iconKey: "phone",
        },
        {
          label: "Email",
          value: "Elmonolonerianaval@gmail.com",
          href: "mailto:Elmonolonerianaval@gmail.com",
          iconKey: "mail",
        },
        {
          label: "Dirección",
          value: "Tigre, Buenos Aires, Argentina",
          href: "https://maps.app.goo.gl/5yJprtv3uSdtv13M7",
          iconKey: "mapPin",
        },
      ],
    } satisfies FooterNav,
  },

  // ─── Home page ───────────────────────────────────────────────────────
  home: {
    hero: {
      eyebrow: "Lonería naval — El MONO",
      titlePrefix: "Lonas, capotas y fundas que ",
      titleHighlight: "resisten cualquier intemperie",
      description:
        "Confección de lonas, cerramientos, capotas, cubreautos y fundas para motos de agua. Trabajo a medida con materiales técnicos de alta durabilidad.",
      primaryCta: "Ver Productos",
      secondaryCta: "Ver Trabajos",
      videos: [
        { src: "/videos/hero-video-01.webm", srcFallback: "/videos/hero-video-01.mp4", poster: "/videos/hero-video-01-poster.webp", alt: "Trabajo de taller — confección de lona" },
        { src: "/videos/hero-video-02.webm", srcFallback: "/videos/hero-video-02.mp4", poster: "/videos/hero-video-02-poster.webp", alt: "Trabajo de taller — lonería naval" },
        { src: "/videos/hero-video-03.webm", srcFallback: "/videos/hero-video-03.mp4", poster: "/videos/hero-video-03-poster.webp", alt: "Trabajo de taller — confección de lona" },
        { src: "/videos/hero-video-04.webm", srcFallback: "/videos/hero-video-04.mp4", poster: "/videos/hero-video-04-poster.webp", alt: "Trabajo de taller — lonería naval" },
        { src: "/videos/hero-video-05.webm", srcFallback: "/videos/hero-video-05.mp4", poster: "/videos/hero-video-05-poster.webp", alt: "Trabajo de taller — confección de lona" },
      ],
    } satisfies HeroData,

    sections: {
      whatWeOffer: {
        eyebrow: "¿Qué ofrecemos?",
        title: "Encontrá lo que buscas",
        theme: "dark",
        titlesAlign: "start",
      },
      aboutUs: {
        eyebrow: "Sobre Nosotros",
        title: "Trabajos a Medida",
        theme: "dark",
        titlesAlign: "start",
      },
      testimonials: {
        eyebrow: "Testimonios",
        title: "Nuestros Clientes",
        theme: "light",
        titlesAlign: "center",
      },
      faq: {
        eyebrow: "FAQ's",
        title: "Preguntas frecuentes",
        theme: "dark",
        titlesAlign: "center",
      },
    } satisfies SectionsGroup,

    splitCards: [
      { title: "Productos", imageKey: "productos-card" },
      { title: "Trabajos", imageKey: "trabajos-card" },
    ] satisfies SplitCardData[],

    masonryItems: [
      {
        id: "hm-gallery-1",
        img: "capota-01",
        alt: "Capota rígida para embarcación",
        title: "Capotas",
        redirectUrl: "/trabajos#album",
      },
      {
        id: "hm-gallery-2",
        img: "carpa-01",
        alt: "Carpa toldo para embarcación",
        title: "Carpas",
        redirectUrl: "/trabajos#album",
      },
      {
        id: "hm-gallery-3",
        img: "cerramiento-01",
        alt: "Cerramiento lateral para embarcación",
        title: "Cerramientos",
        redirectUrl: "/trabajos#album",
      },
      {
        id: "hm-gallery-4",
        img: "toneau-01",
        alt: "Toneau para pick-up",
        title: "Toneau",
        redirectUrl: "/trabajos#album",
      },
    ] satisfies MasonryItem[],

    aboutSection: {
      description:
        "Lonas, capotas y fundas a medida. Hecho en nuestro taller ubicado en Tigre, Buenos Aires. Trabajo artesanal con materiales de Marcas lider mundiales!",
      cta: { text: "Trabajos Realizados", href: "/servicios" },
    } satisfies AboutUsContent,

    reviews,
    faqs,
    aboutUsSection,
  },

  // ─── Products page ───────────────────────────────────────────────────
  products: {
    categories: [
      {
        id: "broches",
        name: "Broches",
        description:
          "Broches de presión profesionales para lonas, capotas y cubiertas náuticas. Disponibles en varios acabados y materiales para cada tipo de aplicación.",
        imageKey: "services-01",
        products: [
          { id: "b7", title: "Broche Lona Macho Bronce Blanco", description: "Broche lona macho en bronce blanco, para sujeción de lonas.", imageKey: "bronze-blanco" },
          { id: "b8", title: "Broche Lona Macho Bronce Gris", description: "Broche lona macho en bronce gris, para sujeción de lonas.", imageKey: "broze-gris" },
          { id: "b9", title: "Broche Lona Macho Bronce Negro", description: "Broche lona macho en bronce negro, para sujeción de lonas.", imageKey: "bronze-negro" },
          { id: "b10", title: "Broche Lona Macho Común Bronce", description: "Broche lona macho común en bronce, para sujeción de lonas.", imageKey: "comun-bronze" },
          { id: "b11", title: "Broche Lona Macho Común Con Cubeta", description: "Broche lona macho común con cubeta, para sujeción de lonas.", imageKey: "comun-con-cubeta" },
          { id: "b12", title: "Broche Lona Macho Común Acero Inoxidable", description: "Broche lona macho común en acero inoxidable, para sujeción de lonas.", imageKey: "comun-inox" },
          { id: "b13", title: "Broche Lona Macho Negro Con Cubeta", description: "Broche lona macho en negro con cubeta, para sujeción de lonas.", imageKey: "negro-con-cubeta" },
          { id: "b5", title: "Broche Lona Hembra Bronce", description: "Broche lona hembra en bronce, para sujeción de lonas y correas.", imageKey: "hembra-bronze" },
          { id: "b6", title: "Broche Lona Hembra Acero Inoxidable", description: "Broche lona hembra en acero inoxidable, para sujeción de lonas y correas.", imageKey: "hembra-inox" },
          { id: "b1", title: "Broche Casco Atornillado Negro", description: "Broche a presión de carcasa tipo baca, acabado negro.", imageKey: "atornillado-negro" },
          { id: "b2", title: "Broche Casco Pegado Blanco", description: "Broche a presión de carcasa tipo baca, acabado blanco.", imageKey: "pegado" },
          { id: "b3", title: "Broche Casco Atornillado Acero Inoxidable", description: "Broche a presión de carcasa tipo bacp, para uso intensivo.", imageKey: "atornillado-inox" },
          { id: "b4", title: "Broche Rompevientos", description: "Broche a presión de carcasa tipo bar, para decoración naval.", imageKey: "rompevientos" },
        ],
      },
      {
        id: "caballetes",
        name: "Caballetes",
        description:
          "Caballetes de acero inoxidable diseñados para soportar las condiciones más exigentes. Resistentes a la corrosión y aptos para uso marino prolongado.",
        imageKey: "services-02",
        products: [
          { id: "c1", title: "Caballete Tubo Acero Inoxidable", description: "Caballete de caño de acero inoxidable, resistente a la corrosión y apto para intemperie.", imageKey: "tubo-inox" },
        ],
        videoUrl: "https://www.youtube.com/watch?v=M7f2f4AeISg",
      },
      {
        id: "capota",
        name: "Herrajes",
        description:
          "Bases, codos y palos de soporte para capotas. Herrajes en acero inoxidable y terminaciones blancas y negras para anclar la estructura de tu capota a la embarcación.",
        imageKey: "services-02",
        products: [
          { id: "cp1", title: "Base Blanca", description: "Base de anclaje para capota, terminación blanca.", imageKey: "base-blanca" },
          { id: "cp2", title: "Base Acero Inoxidable Phillips", description: "Base de anclaje en acero inoxidable con tornillo Phillips.", imageKey: "base-inox-phillips" },
          { id: "cp3", title: "Base Acero Inoxidable Plana", description: "Base de anclaje en acero inoxidable de perfil plano.", imageKey: "base-inox-plano" },
          { id: "cp4", title: "Base Acero Inoxidable Simple", description: "Base de anclaje en acero inoxidable, modelo simple.", imageKey: "base-inox-simple" },
          { id: "cp5", title: "Base Negra", description: "Base de anclaje para capota, terminación negra.", imageKey: "base-negro" },
          { id: "cp6", title: "Codo Final Blanco", description: "Codo de terminación final en color blanco.", imageKey: "codo-final-blanco" },
          { id: "cp7", title: "Codo Final Acero Inoxidable", description: "Codo de terminación final en acero inoxidable.", imageKey: "codo-final-inox" },
          { id: "cp8", title: "Codo Final Negro", description: "Codo de terminación final en color negro.", imageKey: "codo-final-negro" },
          { id: "cp9", title: "Codo Acero Inoxidable", description: "Codo de acero inoxidable para estructura de capota.", imageKey: "codo-inox" },
          { id: "cp10", title: "Palo Común", description: "Palo de soporte común para capota.", imageKey: "palo-comun" },
          { id: "cp11", title: "Palo Rebatible", description: "Palo de soporte rebatible para guardado fácil de la capota.", imageKey: "palo-rebatible" },
        ],
      },
      {
        id: "carros",
        name: "Carros",
        description:
          "Carros y perros de plástico y chapa para cremalleras de lonas y capotas. En medidas estándar y terminados blanco o negro según tu estructura.",
        imageKey: "services-01",
        products: [
          { id: "cr6", title: "Carros Perro N5 Blanco", description: "Perro en color blanco, medida N5.", imageKey: "perro-n5-blanco" },
          { id: "cr7", title: "Carros Perro N5 Negro", description: "Perro en color negro, medida N5.", imageKey: "perro-n5-negro" },
          { id: "cr1", title: "Carros Mono N8", description: "Carro mono de arrastre, medida N8.", imageKey: "mono-n8" },
          { id: "cr2", title: "Carros Perro Chapa N10 Blanco", description: "Perro de chapeta en color blanco, medida N10.", imageKey: "perro-n10-chapa-blanco" },
          { id: "cr3", title: "Carros Perro Chapa N10 Negro", description: "Perro de chapeta en color negro, medida N10.", imageKey: "perro-n10-chapa-negro" },
          { id: "cr4", title: "Carros Perro Plástico N10 Blanco", description: "Perro de plástico en color blanco, medida N10.", imageKey: "perro-n10-plastico-blanco" },
          { id: "cr5", title: "Carros Perro Plástico N10 Negro", description: "Perro de plástico en color negro, medida N10.", imageKey: "perro-n10-plastico-negro" },
        ],
        videoUrl: "https://www.youtube.com/shorts/eLq0bl-34F8",
      },
      {
        id: "correas",
        name: "Correas",
        description:
          "Correas y tensores para fijación y ajuste de lonas, capotas y cubiertas. Con terminales inox y blanco según el acabado de tu trabajo.",
        imageKey: "services-03",
        products: [
          { id: "co1", title: "Correa Blanca", description: "Correa de sujeción en color blanco.", imageKey: "correa-blanca" },
          { id: "co5", title: "Correa Negra", description: "Correa de ajuste en color negro.", imageKey: "correa-negra" },
          { id: "co6", title: "Tensor Correa Mosquetón", description: "Tensor de correa con mosquetón de fijación rápida.", imageKey: "tensa-correa-mosqueton" },
          { id: "co3", title: "Correa Acero Inoxidable", description: "Correa de casco con terminación acero inoxidable.", imageKey: "correa-casco-inox" },
          { id: "co2", title: "Correa Casco Blanco", description: "Correa de casco en color blanco.", imageKey: "correa-casco-blanca" },
          { id: "co4", title: "Correa Casco Negro", description: "Correa de casco en color negro.", imageKey: "correa-casco-negra" },
        ],
      },
      {
        id: "hilos",
        name: "Hilos",
        description:
          "Hilos de costura resistentes para alones y lonería naval, en los colores más usados. Pensados para soportar tensión, sol y salitre.",
        imageKey: "services-04",
        products: [
          { id: "h1", title: "Hilo Blanco", description: "Hilo de costura alta resistencia en color blanco.", imageKey: "hilo-blanco" },
          { id: "h3", title: "Hilo Negro", description: "Hilo de costura alta resistencia en color negro.", imageKey: "hilo-negro" },
          { id: "h2", title: "Hilo Gris", description: "Hilo de costura alta resistencia en color gris.", imageKey: "hilo-gris" },
        ],
      },
      {
        id: "omegas",
        name: "Omegas",
        description:
          "Omegas de refuerzo para tornamos y refuerzos de tela. En acero inoxidable o plástico, con terminación acorde a cada uso náutico.",
        imageKey: "services-05",
        products: [
          { id: "o1", title: "Omega Acero Inoxidable", description: "Omega de refuerzo en acero inoxidable.", imageKey: "omega-inox" },
          { id: "o2", title: "Omega Plástico Blanco", description: "Omega de refuerzo en plástico color blanco.", imageKey: "omega-plastico-blanca" },
          { id: "o3", title: "Omega Plástico Negro", description: "Omega de refuerzo en plástico color negro.", imageKey: "omega-plastico-negra" },
        ],
      },
      {
        id: "tomas-de-aire",
        name: "Tomas de Aire",
        description:
          "Ventilación y tomas de aire para embarcaciones. Mantienen la circulación y evitan condensación en compartimientos cerrados.",
        imageKey: "services-06",
        products: [
          { id: "t1", title: "Toma Boat Vent 3", description: "Toma de aire estilo Boat Vent, modelo 3.", imageKey: "toma-boat-vent-3" },
          { id: "t2", title: "Toma Boat Vent", description: "Toma de aire estilo Boat Vent para ventilación interior.", imageKey: "toma-boat-vent" },
          { id: "t3", title: "Toma Genérica", description: "Toma de aire genérica para compartimientos cerrados.", imageKey: "toma-generica" },
        ],
      },
      {
        id: "trabamochilas",
        name: "Trabamochilas",
        description:
          "Trabamochilas para cierre de mochilas y bolillos de transporte. Terminaciones blanco y negro para ajustarse a tu trabajo.",
        imageKey: "services-07",
        products: [
          { id: "tm1", title: "Trabamochilas Blanco", description: "Trabamochilas para cierre en color blanco.", imageKey: "trabamochilas-blanco" },
          { id: "tm2", title: "Trabamochilas Negro", description: "Trabamochilas para cierre en color negro.", imageKey: "trabamochilas-negro" },
        ],
      },
    ] satisfies ProductCategoryData[],
  },

  // ─── Works page ──────────────────────────────────────────────────────
  worksPage: {
    trabajos,
  } satisfies WorksPageData,

  // ─── Brands ──────────────────────────────────────────────────────────
  brands: [
    { id: "sauleda-logo", alt: "Sauleda", link: "https://sauleda.com/" },
    { id: "ykk-logo", alt: "YKK", link: "https://argentina.ykkamericas.com/" },
    { id: "sunbrella-logo", alt: "Sunbrella", link: "https://global.sunbrella.com" },
    { id: "coats-logo", alt: "Coats", link: "https://www.coats.com/" },
    { id: "achilles-logo", alt: "Achilles" },
  ] satisfies BrandData[],

  // ─── Deprecated backward-compat aliases ──────────────────────────────

  /** @deprecated import from `data.home.reviews` instead. Kept for backward compatibility. */
  Home: {
    Sections: [reviewsSection, aboutUsSection] satisfies Section[],
    Works: [],
    Reviews: reviews,
    FAQs: faqs,
  },
};
