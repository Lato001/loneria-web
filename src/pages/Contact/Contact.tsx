import { LinkButton, MapSection, SectionWrapper, NextPageCta } from "../../components/ui";
import { ContactGrid } from "../../components/ui/ContactGrid/ContactGrid";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import acuarelaImg from "../../assets/backgrounds/formas-acuarela-01.webp";
/**
 * Contact page — page-level SectionWrapper (h1) with the page description and
 * a 2-column grid: contact info card (phone, email, address) and WhatsApp CTA.
 */
export function Contact() {
  useDocumentMeta({
    title: "Contacto y ubicación",
    description:
      "Escribinos por WhatsApp para tu presupuesto, visitá el taller en Tigre o mandanos un email. Te respondemos el mismo día.",
    path: "/contacto",
  });

  return (
    <>
      <SectionWrapper
        eyebrow="Ubicacion"
        title="Donde encontrarnos"
        titlesAlign="center"
        backgroundImage={acuarelaImg}
        className="w-full pt-34 "
      >
        <MapSection
          latitude={-34.4351676}
          longitude={-58.5956366}
          zoom={15}
          markerLabel="El Mono Lonería Naval"
        />
        <div className="mt-10 flex justify-center">
          <LinkButton
          theme="light"
            type="Google"
            text="Abrir en Google Maps"
            url="https://maps.app.goo.gl/5yJprtv3uSdtv13M7"
          />
        </div>
      </SectionWrapper>
      <SectionWrapper
        eyebrow="Contacto"
        title="Hablemos de tu proyecto"
        titlesAlign="start"
        headingLevel="h1"
        theme="light"
      >
        <ContactGrid></ContactGrid>
        <NextPageCta className="pt-15"/>
      </SectionWrapper>
    </>
  );
}
