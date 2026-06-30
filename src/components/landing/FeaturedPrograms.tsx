"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  duration: string | null;
  price: string | null;
  categoryId: string;
  category?: {
    name: string;
  };
  imageUrl?: string | null;
  imageUrls?: string[] | null;
}

interface FeaturedProgramsProps {
  programs: Program[];
}

const getProgramImage = (program: Program) => {
  if (program.imageUrls && program.imageUrls.length > 0) {
    return program.imageUrls[0];
  }
  if (program.imageUrl) {
    return program.imageUrl;
  }
  
  // Fallbacks mapped to local webp assets
  const fallbackImages: Record<string, string> = {
    "semiconductor-wafer-fabrication": "/images/programs/wafer-fabrication.webp",
    "advanced-analytical-failure-analysis": "/images/programs/analytical-failure-analysis.webp",
    "fundamental-cmos-amplifier-design": "/images/programs/cmosamplifierdesign.webp",
    "nanoindentation-training": "/images/programs/nanoindentation.webp",
    "electrical-engineering-non-engineers": "/images/programs/electrical-engineering-1.webp",
    "certified-data-science-practitioner": "/images/programs/certified-data-science-practitioner-1.webp",
    "ai-system-thinking": "/images/programs/aisystemthinking.webp",
    "ttt-certified-ai-trainer": "/images/programs/ttt-1.webp",
    "mastering-vibe-coding": "/images/programs/vibe-coding-1.webp",
    "cybersecurity-awareness": "/images/programs/cybersecurity-1.webp",
    "pmp-certification-training": "/images/programs/pmp.webp"
  };
  
  return fallbackImages[program.slug] || "/images/programs/wafer-fabrication.webp";
};

// Pure sliding transition variants (no fade)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%"
  }),
  center: {
    x: 0
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%"
  })
};

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!programs || programs.length === 0) {
    return null;
  }

  const total = programs.length;
  const activeProgram = programs[activeIndex];
  const activeProgramImage = getProgramImage(activeProgram);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleSelect = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  // Get next 6 programs as preview strips on the right
  const previewCount = Math.min(6, total - 1);
  const nextIndices: number[] = [];
  for (let i = 1; i <= previewCount; i++) {
    nextIndices.push((activeIndex + i) % total);
  }

  // Sizing details matching Stripe design inspiration:
  // - 1 to 3 size from big to small
  // - 4 to 6 are really thin
  const getStripWidthClass = (index: number) => {
    switch (index) {
      case 0:
        return "w-[60px] md:w-[80px] lg:w-[96px] block";
      case 1:
        return "w-[36px] md:w-[44px] lg:w-[52px] block";
      case 2:
        return "w-[20px] md:w-[24px] lg:w-[28px] block";
      case 3:
      case 4:
      case 5:
        return "w-[6px] lg:w-[8px] hidden lg:block";
      default:
        return "w-10 block";
    }
  };

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16 relative">
        
        {/* Section Header */}
        <div className="flex items-end justify-between pb-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-650 font-body leading-relaxed">
              Accelerate your engineering credentials. Explore our flagship upskilling courses in Semiconductor fabrication, advanced Artificial Intelligence, and Professional Project Management.
            </p>
          </div>
          
          {/* Navigation Arrows */}
          {total > 1 && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="inline-flex h-10 w-10 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-none"
                aria-label="Previous Program"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="inline-flex h-10 w-10 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-none"
                aria-label="Next Program"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Interactive Slider Block */}
        <div className="mt-6 flex flex-row gap-3 h-[200px] sm:h-[280px] md:h-[340px] w-full items-stretch">
          
          {/* Left Area: Main Large Active Image (Not Clickable) */}
          <div className="flex-1 relative overflow-hidden border border-slate-200 bg-slate-50 rounded-[4px]">
            <AnimatePresence initial={false} custom={direction}>
              {activeProgramImage ? (
                <motion.img
                  key={activeIndex}
                  src={activeProgramImage}
                  alt={activeProgram.title}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <motion.div
                  key={`placeholder-${activeIndex}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-50"
                >
                  <GraduationCap className="h-16 w-16 text-slate-300" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ambient Shadow Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Category Tag */}
            <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm z-10 select-none">
              {activeProgram.category?.name || "Upskilling"}
            </span>
          </div>

          {/* Right Area: Preview Strips */}
          {total > 1 && (
            <div className="hidden md:flex gap-3 shrink-0 h-full items-stretch">
              {/* Strips 1 and 2 */}
              {nextIndices.slice(0, 2).map((idx, index) => {
                const prog = programs[idx];
                const progImage = getProgramImage(prog);
                return (
                  <button
                    key={prog.id}
                    onClick={() => handleSelect(idx)}
                    className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-all duration-300 group cursor-pointer rounded-[4px] ${getStripWidthClass(
                      index
                    )}`}
                    aria-label={`Show program: ${prog.title}`}
                  >
                    {progImage ? (
                      <img
                        src={progImage}
                        alt={prog.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                        <GraduationCap className="h-6 w-6 text-slate-350" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                  </button>
                );
              })}

              {/* Strips 3, 4, 5, 6 with narrower gap */}
              <div className="flex flex-row gap-[4px] lg:gap-[6px] h-full items-stretch">
                {nextIndices.slice(2).map((idx, index) => {
                  const originalIndex = index + 2;
                  const prog = programs[idx];
                  const progImage = getProgramImage(prog);
                  return (
                    <button
                      key={prog.id}
                      onClick={() => handleSelect(idx)}
                      className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-all duration-300 group cursor-pointer rounded-[4px] ${getStripWidthClass(
                        originalIndex
                      )}`}
                      aria-label={`Show program: ${prog.title}`}
                    >
                      {progImage ? (
                        <img
                          src={progImage}
                          alt={prog.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <GraduationCap className="h-6 w-6 text-slate-350" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Text Section Below Image Block */}
        <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Active Program Info */}
          <div className="max-w-3xl space-y-2">
            <Link href={`/programs/${activeProgram.slug}`} className="group/title inline-block">
              <h3 className="font-heading text-2xl font-extrabold text-slate-900 group-hover/title:text-primary transition-colors leading-snug">
                {activeProgram.title}
              </h3>
            </Link>
            <p className="text-sm sm:text-md text-slate-655 font-body leading-relaxed">
              {activeProgram.description}
            </p>
          </div>

          {/* Button: Explore All Programmes */}
          <div className="shrink-0 pt-1">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-1.5 rounded-none bg-primary px-6 py-3.5 text-xs font-bold text-white hover:bg-primary-hover transition-all duration-200 group"
            >
              <span>Explore All Programmes</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
