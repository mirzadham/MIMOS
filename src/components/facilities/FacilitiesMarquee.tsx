"use client";

import { motion } from "framer-motion";

interface FacilitiesMarqueeProps {
  text?: string;
}

export default function FacilitiesMarquee({
  text = "FACILITIES /// APPLIED R&D ENVIRONMENTS /// SEMICONDUCTOR FAB /// AI & 5G HUB /// CYBER SECURITY RANGE ///",
}: FacilitiesMarqueeProps) {
  const marqueeContent = `${text} ${text} ${text} ${text}`;

  return (
    <div className="w-full overflow-hidden bg-slate-950/80 border-y border-slate-900 py-4 select-none">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex items-center gap-8 text-xs sm:text-sm font-mono tracking-[0.25em] text-primary/80 uppercase"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          <span className="font-semibold">{marqueeContent}</span>
          <span className="font-semibold">{marqueeContent}</span>
        </motion.div>
      </div>
    </div>
  );
}
