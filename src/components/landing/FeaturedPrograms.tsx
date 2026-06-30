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
  const [transitionMode, setTransitionMode] = useState<"A" | "B" | "C">("A");

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

  // Previews sizing details:
  // - 1 to 3 size from big to small
  // - 4 to 6 are thin and uniform
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

  // Previews spacing:
  // - Wider gap between first 3
  // - Narrower gap between 3-6
  const getStripMarginClass = (index: number) => {
    if (index < 2) {
      return "mr-3";
    }
    if (index < 5) {
      return "mr-[4px] lg:mr-[6px]";
    }
    return "mr-0";
  };

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 pb-6 mb-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-600 font-body leading-relaxed">
              Accelerate your engineering credentials. Explore our flagship upskilling courses.
            </p>
          </div>

          {/* Interactive Demo Mode Toggle Selector & Nav Arrows */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 bg-slate-50 p-2 border border-slate-200 rounded-[6px]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-550 uppercase tracking-wide">
              <span>Transition Demo:</span>
              <button
                onClick={() => setTransitionMode("A")}
                className={`px-2 py-1 text-[10px] border cursor-pointer rounded-[4px] font-semibold transition-all ${
                  transitionMode === "A"
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary"
                }`}
              >
                A: Card Slide
              </button>
              <button
                onClick={() => setTransitionMode("B")}
                className={`px-2 py-1 text-[10px] border cursor-pointer rounded-[4px] font-semibold transition-all ${
                  transitionMode === "B"
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary"
                }`}
              >
                B: Morph
              </button>
              <button
                onClick={() => setTransitionMode("C")}
                className={`px-2 py-1 text-[10px] border cursor-pointer rounded-[4px] font-semibold transition-all ${
                  transitionMode === "C"
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary"
                }`}
              >
                C: Slide Track
              </button>
            </div>

            {/* Navigation Arrows */}
            {total > 1 && (
              <div className="flex gap-1.5">
                <button
                  onClick={handlePrev}
                  className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-205 cursor-pointer rounded-[4px]"
                  aria-label="Previous Program"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-205 cursor-pointer rounded-[4px]"
                  aria-label="Next Program"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* -------------------- DEMO MODE A: UNIFIED CARD SLIDE -------------------- */}
        {transitionMode === "A" && (
          <div className="w-full flex flex-col">
            <div className="flex flex-row gap-3 h-[200px] sm:h-[280px] md:h-[340px] w-full items-stretch">
              
              {/* Left Area: Main sliding content card (Image + Text sliding together) */}
              <div className="flex-1 relative overflow-hidden rounded-[4px]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                    className="absolute inset-0 w-full h-full flex flex-col"
                  >
                    {/* Image Block */}
                    <div className="flex-1 w-full relative overflow-hidden border border-slate-200 bg-slate-50 rounded-[4px]">
                      {activeProgramImage ? (
                        <img
                          src={activeProgramImage}
                          alt={activeProgram.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                          <GraduationCap className="h-16 w-16 text-slate-300" />
                        </div>
                      )}
                      
                      {/* Ambient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm z-10 select-none">
                        {activeProgram.category?.name || "Upskilling"}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Area: Preview Strips sliding using Framer Motion layout */}
              {total > 1 && (
                <div className="hidden md:flex shrink-0 h-full items-stretch">
                  {nextIndices.map((idx, index) => {
                    const prog = programs[idx];
                    const progImage = getProgramImage(prog);
                    return (
                      <motion.button
                        layout
                        key={`mode-a-${prog.id}`}
                        onClick={() => handleSelect(idx)}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-colors duration-300 group cursor-pointer rounded-[4px] ${getStripWidthClass(
                          index
                        )} ${getStripMarginClass(index)}`}
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
                            <GraduationCap className="h-6 w-6 text-slate-355" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sliding text information below the image, synced with activeIndex */}
            <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-3xl relative overflow-hidden h-[90px] md:h-[110px]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                    className="absolute inset-0 w-full h-full space-y-2"
                  >
                    <Link href={`/programs/${activeProgram.slug}`} className="group/title inline-block">
                      <h3 className="font-heading text-2xl font-extrabold text-slate-900 group-hover/title:text-primary transition-colors leading-snug">
                        {activeProgram.title}
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-md text-slate-650 font-body leading-relaxed line-clamp-3">
                      {activeProgram.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Static CTA Button (stays fixed in place) */}
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
        )}

        {/* -------------------- DEMO MODE B: MORPHING PREVIEWS -------------------- */}
        {transitionMode === "B" && (
          <div className="w-full flex flex-col">
            <div className="flex flex-row gap-3 h-[200px] sm:h-[280px] md:h-[340px] w-full items-stretch">
              
              {/* Left Area: Main Large Active Image (Framer Motion layoutId morphing) */}
              <motion.div
                layoutId={`morph-container-${activeProgram.id}`}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="flex-1 relative overflow-hidden border border-slate-200 bg-slate-50 rounded-[4px]"
              >
                {activeProgramImage ? (
                  <motion.img
                    layoutId={`morph-image-${activeProgram.id}`}
                    src={activeProgramImage}
                    alt={activeProgram.title}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    layoutId={`morph-placeholder-${activeProgram.id}`}
                    className="absolute inset-0 flex items-center justify-center bg-slate-50"
                  >
                    <GraduationCap className="h-16 w-16 text-slate-300" />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm z-10 select-none">
                  {activeProgram.category?.name || "Upskilling"}
                </span>
              </motion.div>

              {/* Right Area: Preview Strips morphing into active container */}
              {total > 1 && (
                <div className="hidden md:flex shrink-0 h-full items-stretch">
                  {nextIndices.map((idx, index) => {
                    const prog = programs[idx];
                    const progImage = getProgramImage(prog);
                    return (
                      <motion.button
                        layoutId={`morph-container-${prog.id}`}
                        key={`mode-b-${prog.id}`}
                        onClick={() => handleSelect(idx)}
                        transition={{ type: "spring", stiffness: 220, damping: 26 }}
                        className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-colors duration-300 group cursor-pointer rounded-[4px] ${getStripWidthClass(
                          index
                        )} ${getStripMarginClass(index)}`}
                        aria-label={`Show program: ${prog.title}`}
                      >
                        {progImage ? (
                          <motion.img
                            layoutId={`morph-image-${prog.id}`}
                            src={progImage}
                            alt={prog.title}
                            transition={{ type: "spring", stiffness: 220, damping: 26 }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <motion.div
                            layoutId={`morph-placeholder-${prog.id}`}
                            className="absolute inset-0 flex items-center justify-center bg-slate-50"
                          >
                            <GraduationCap className="h-6 w-6 text-slate-355" />
                          </motion.div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mode B static description text */}
            <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
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
        )}

        {/* -------------------- DEMO MODE C: SLIDING TRACK -------------------- */}
        {transitionMode === "C" && (
          <div className="w-full flex flex-col overflow-hidden">
            <div className="mt-6 w-full h-[200px] sm:h-[280px] md:h-[340px] relative overflow-hidden">
              <motion.div
                animate={{ x: -activeIndex * 32 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="flex flex-row h-full items-stretch"
              >
                {programs.map((prog, idx) => {
                  const isActive = idx === activeIndex;
                  const progImage = getProgramImage(prog);
                  
                  // Width rules: active grew large, others are strips
                  let widthClass = "w-[6px] lg:w-[8px] block";
                  if (isActive) {
                    widthClass = "w-[200px] sm:w-[400px] md:w-[500px] block"; 
                  } else {
                    const distance = (idx - activeIndex + total) % total;
                    if (distance === 1) widthClass = "w-[60px] md:w-[80px] lg:w-[96px] block";
                    else if (distance === 2) widthClass = "w-[36px] md:w-[44px] lg:w-[52px] block";
                    else if (distance === 3) widthClass = "w-[20px] md:w-[24px] lg:w-[28px] block";
                    else if (distance <= 6) widthClass = "w-[6px] lg:w-[8px] hidden md:block";
                    else widthClass = "hidden";
                  }

                  return (
                    <motion.button
                      layout
                      key={`mode-c-${prog.id}`}
                      onClick={() => handleSelect(idx)}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-colors duration-300 rounded-[4px] mr-3 ${widthClass}`}
                    >
                      {progImage ? (
                        <img
                          src={progImage}
                          alt={prog.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <GraduationCap className="h-6 w-6 text-slate-355" />
                        </div>
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Mode C description text */}
            <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
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
        )}

      </div>
    </section>
  );
}
