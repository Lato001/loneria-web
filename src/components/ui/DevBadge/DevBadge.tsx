// Tooltip animado adaptado de "Animated Tooltip" — Aceternity UI
// (https://ui.aceternity.com/components/animated-tooltip), reescrito para un
// único avatar (el original está pensado para grupos) y sin dependencias nuevas:
// usa framer-motion (ya instalado) y @tabler/icons-react (ya instalado) para
// los íconos de marca.
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { DevBadgeProps } from "./DevBadge.types";

const springConfig = { stiffness: 260, damping: 20 };

export function DevBadge({
  name,
  role = "Frontend Developer",
  initials,
  linkedinUrl,
  photoSrc,
  whatsappNumber,
  whatsappMessage = "Hola! Vi tu firma en un sitio que desarrollaste y quiero hacerte una consulta.",
  className = "",
}: DevBadgeProps) {
  const [hovered, setHovered] = useState(false);

  // Sigue el cursor sobre el avatar para inclinar/desplazar el tooltip,
  // igual que el original de Aceternity.
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-60, 60], [-12, 12]), springConfig);
  const translateX = useSpring(useTransform(x, [-60, 60], [-24, 24]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Avatar con tooltip — el click abre LinkedIn directamente */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`LinkedIn de ${name}`}
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              }}
              exit={{ opacity: 0, y: 12, scale: 0.6 }}
              style={{ translateX, rotate }}
              className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-lg bg-[#171F5E] px-3.5 py-2 shadow-lg"
            >
              <span className="text-[14px] font-semibold text-[#F5F7FF]">
                {name}
              </span>
              <span className="text-[12px] text-[#8DE0D6]">{role}</span>
              <span className="text-[10px] text-[#B9C0E8]">Ver LinkedIn ↗</span>
              {/* Flechita del tooltip */}
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#171F5E]" />
            </motion.div>
          )}
        </AnimatePresence>

        <span
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10
                     bg-gradient-to-br from-[#4FE0D0] to-[#2AA9C9]
                     transition-transform duration-200 hover:scale-105"
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-bold text-[#0F1547]">{initials}</span>
          )}
        </span>
      </a>

      {/* Texto + link a WhatsApp, separados del avatar */}
      <div className="flex items-center gap-2">
        <span className="flex flex-col leading-none">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#B9C0E8]">
            Desarrollado por
          </span>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-semibold text-[#F5F7FF] hover:text-[#4FE0D0]"
          >
            {name}
          </a>
        </span>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escribir a ${name} por WhatsApp`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#B9C0E8] transition-colors duration-200 hover:bg-white/10 hover:text-[#4FE0D0]"
          >
            <IconBrandWhatsapp size={30} stroke={1.75} />
          </a>
        )}
      </div>
    </div>
  );
}