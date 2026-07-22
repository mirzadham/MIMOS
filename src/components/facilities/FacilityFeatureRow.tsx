"use client";

import { motion, Variants } from "framer-motion";
import FacilityImageCard from "./FacilityImageCard";

export interface Facility {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  desc: string;
  specs: string[];
}

interface FacilityFeatureRowProps {
  facility: Facility;
  rowIndex: number;
  onImageClick: (src: string, title: string, subtitle: string) => void;
}

const specsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const specItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function FacilityFeatureRow({
  facility,
  rowIndex,
  onImageClick,
}: FacilityFeatureRowProps) {
  const isReversed = rowIndex % 2 === 1;
  const formattedIndex = facility.index || (rowIndex + 1 < 10 ? `0${rowIndex + 1}` : `${rowIndex + 1}`);

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`flex flex-col lg:items-center gap-10 lg:gap-14 ${
            isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          {/* 1. Visual Image Block with Ambient Glow Aura & 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="relative group/aura">
              {/* Soft Ambient Glow Aura on Hover */}
              <div className="absolute -inset-1.5 rounded-sm bg-gradient-to-r from-primary/15 via-cyan-500/10 to-primary/15 blur-xl opacity-0 group-hover/aura:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <FacilityImageCard
                src={facility.imageUrl}
                alt={facility.title}
                title={facility.title}
                subtitle={facility.subtitle}
                priority={rowIndex === 0}
                onImageClick={onImageClick}
              />
            </div>
          </motion.div>

          {/* 2. Content Details Block with Enhanced Typography & Accent List */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-5"
          >
            {/* Number Indicator & Subtitle */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                {`[ ${formattedIndex} ]`}
              </span>
              <span className="text-slate-300 text-xs select-none">•</span>
              <span className="text-xs font-sans tracking-widest text-slate-500 uppercase font-semibold">
                {facility.subtitle}
              </span>
            </div>

            {/* Main Lab Title Header */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase leading-snug font-heading">
              {facility.title}
            </h2>

            {/* Description Copy */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-body">
              {facility.desc}
            </p>

            {/* Capabilities Section with Vertical Accent Line & Micro-Bullets */}
            {facility.specs && facility.specs.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-sans font-semibold tracking-widest text-slate-400 uppercase block mb-1">
                  CAPABILITIES
                </span>

                {/* Vertical Accent Column */}
                <motion.div
                  variants={specsContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="border-l-2 border-primary/25 pl-4 space-y-2.5 my-2"
                >
                  {facility.specs.map((spec, sIdx) => {
                    const parts = spec.split(": ");
                    const label = parts[0];
                    const content = parts.slice(1).join(": ");

                    return (
                      <motion.div
                        key={sIdx}
                        variants={specItemVariants}
                        className="group/item cursor-default text-xs sm:text-sm leading-relaxed flex items-start gap-2.5"
                      >
                        {/* Micro Magenta Accent Bullet */}
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5 group-hover/item:bg-primary group-hover/item:scale-125 transition-all" />

                        <div>
                          <span className="font-semibold text-slate-900 group-hover/item:text-primary transition-colors">
                            {label}
                          </span>
                          {content && (
                            <span className="text-slate-600 font-normal"> — {content}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
