// Mini tooltip animado adaptado de "Animated Tooltip" — Aceternity UI. Single
// inline trigger (no avatar, no icon button — just text) that surfaces a
// floating card on hover linking out to the developer's LinkedIn.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DevBadgeProps } from "./DevBadge.types";

export function DevBadge({ name, linkedinUrl, className = "" }: DevBadgeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`flex items-center ${className}`}>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name}'s Contact`}
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
              className="absolute -top-14 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-lg bg-[#171F5E] px-3.5 py-2 shadow-lg"
            >
              <span className="text-[13px] font-semibold text-[#F5F7FF]">
                {name}'s Contact
              </span>
              {/* Flechita del tooltip */}
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#171F5E]" />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="font-poppins text-[12px] uppercase tracking-wider text-[#B9C0E8] transition-colors hover:text-pr-aquamarine">
          Powered by: {name}
        </span>
      </a>
    </div>
  );
}