import { ImgCard, SectionWrapper, NextPageCta } from "../../components/ui";
import { data } from "../../mocks/data";
import CountUp from "../../components/ui/CountUp/CountUp";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import taller01 from "../../assets/img/about/thumbs/taller-01.webp";
import taller02 from "../../assets/img/about/thumbs/taller-02.webp";
import taller03 from "../../assets/img/about/thumbs/taller-03.webp";
import taller04 from "../../assets/img/about/thumbs/taller-04.webp";

// MAPEO DE GALERÍA — imageKey → URL resuelta (patrón decoupling del proyecto).
// Thumbs 480px: las cards del grid miden ~280px en desktop, sobran full-res.
const galleryImageMap: Record<string, string> = {
  "taller-01": taller01,
  "taller-02": taller02,
  "taller-03": taller03,
  "taller-04": taller04,
};

export function AboutUs() {
  useDocumentMeta({
    title: "Nuestro Taller",
    description:
      "Oficio de lonería naval y trabajo artesanal. 20 años de oficio, 500 proyectos entregados y 300 clientes satisfechos.",
    path: "/nosotros",
  });

  const about = data.home.aboutUsSection;

  return (

    <SectionWrapper
      eyebrow={about.eyebrow}
      title={about.title}
      containerClassName="w-full bg-gradient-to-b from-sc-ocean-blue/20 to-pr-aquamarine/20"
      titlesAlign="center"
      headingLevel="h1"
      className="!pb-0"
      >


  <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen ">
  <div className="mx-auto grid grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-6 lg:max-w-6xl lg:grid-cols-4 lg:gap-4 lg:px-10">
    {about.gallery?.map(({ imageKey, alt }) => (
      <ImgCard
      key={imageKey}
      className="aspect-[3/4] max-w-none overflow-hidden rounded-2xl shadow-md shadow-sc-ocean-blue/10 transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-sc-ocean-blue/20"
      imageClassName="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
      src={galleryImageMap[imageKey] ?? ""}
      alt={alt}
      />
    ))}
  </div>
</div>

     <div className=" rounded-3xl  pb-10 ">
      <div className="mt-10 mx-auto flex max-w-290 flex-col gap-6 text-center">
        <div className="p-4">
          <p className="font-poppins font-base text-lg  leading-relaxed text-sc-chalk pb-5">
            {about.content}
          </p>
          <p className="font-poppins font-base text-lg  leading-relaxed text-sc-chalk pb-5">
            {about.content}
          </p>
        </div>
        {about.highlights && about.highlights.length > 0 && (
          <div className="mt-2 grid grid-cols-3">
            {about.highlights.map(({ label, value }) => (
              <div
              key={label}
              className="flex flex-col items-center text-center font-poppins font-semibold"
              >
                <span className="text-3xl text-sc-sky-blue font-medium">
                  <span aria-hidden="true">+</span>
                  <CountUp
                    from={0}
                    to={value}
                    duration={1}
                    direction="up"
                    separator=","
                    delay={0.2}
                    />
                </span>
                <span className="mt-1 text-sm uppercase tracking-wider text-sc-chalk">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}




        <NextPageCta className="pt-10" />
        </div>

      </div>

    </SectionWrapper>

  );
}