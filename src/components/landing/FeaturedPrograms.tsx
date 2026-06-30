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

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!programs || programs.length === 0) {
    return null;
  }

  const total = programs.length;
  const activeProgram = programs[activeIndex];
  const activeProgramImage = getProgramImage(activeProgram);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Get next 4 programs as preview strips on the right (responsive logic handles visibility)
  const previewCount = Math.min(4, total - 1);
  const nextIndices: number[] = [];
  for (let i = 1; i <= previewCount; i++) {
    nextIndices.push((activeIndex + i) % total);
  }

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 relative">
        
        {/* Section Header */}
        <div className="flex items-end justify-between border-b border-slate-200/85 pb-8">
          <div className="space-y-2 max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-600 font-body leading-relaxed">
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
        <div className="mt-12 flex flex-row gap-4 h-[280px] sm:h-[380px] md:h-[450px] w-full items-stretch">
          
          {/* Left Area: Main Large Active Image (Not Clickable) */}
          <div className="flex-1 relative overflow-hidden border border-slate-200 bg-slate-50">
            <AnimatePresence mode="wait">
              {activeProgramImage ? (
                <motion.img
                  key={activeIndex}
                  src={activeProgramImage}
                  alt={activeProgram.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <motion.div
                  key={`placeholder-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-55"
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
            <div className="hidden md:flex gap-4 shrink-0 h-full">
              {nextIndices.map((idx, index) => {
                const prog = programs[idx];
                const progImage = getProgramImage(prog);
                // First 2 strips visible on md, all 4 visible on lg
                const isExtra = index >= 2;
                return (
                  <button
                    key={prog.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-full w-16 sm:w-20 lg:w-24 shrink-0 overflow-hidden border border-slate-200/80 hover:border-primary transition-all duration-300 group cursor-pointer rounded-none ${
                      isExtra ? "hidden lg:block" : "block"
                    }`}
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
                    {/* Darkening overlay that fades on hover */}
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                  </button>
                );
              })}
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
            <p className="text-sm sm:text-md text-slate-650 font-body leading-relaxed">
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
