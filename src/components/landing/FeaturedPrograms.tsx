"use client";

import { useState, useEffect } from "react";
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

// Custom hook to listen to window size updates for responsive calculations
function useWindowWidth() {
  const [width, setWidth] = useState(1200); // Default to desktop fallback

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
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
  const windowWidth = useWindowWidth();

  if (!programs || programs.length === 0) {
    return null;
  }

  const total = programs.length;
  const activeProgram = programs[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Sizing Calculations matching Stripe "What's happening" layout:
  const getCardWidth = (displayPosition: number) => {
    if (displayPosition < 0) {
      return 0; // Card sliding out leftward
    }

    if (isMobile) {
      return displayPosition === 0 ? Math.max(280, windowWidth - 48) : 0;
    }

    if (isTablet) {
      const containerW = Math.min(720, windowWidth - 48);
      const activeW = Math.max(300, containerW - 184); // 184px for 3 previews + gaps
      switch (displayPosition) {
        case 0:
          return activeW;
        case 1:
          return 80;
        case 2:
          return 44;
        case 3:
          return 24;
        default:
          return 0;
      }
    }

    // Desktop
    const containerW = Math.min(848, windowWidth - 48);
    const activeW = Math.max(350, containerW - 254); // 254px for 6 previews + gaps
    switch (displayPosition) {
      case 0:
        return activeW;
      case 1:
        return 96;
      case 2:
        return 52;
      case 3:
        return 28;
      case 4:
      case 5:
      case 6:
        return 8;
      default:
        return 0;
    }
  };

  const getCardMargin = (displayPosition: number) => {
    if (displayPosition < 0) {
      return 0;
    }
    if (isMobile) {
      return 0;
    }
    if (isTablet) {
      if (displayPosition < 3) return 12;
      return 0;
    }
    // Desktop
    if (displayPosition < 3) return 12;
    if (displayPosition < 6) return 6;
    return 0;
  };

  const getCardOpacity = (displayPosition: number) => {
    if (displayPosition < 0) return 0;
    if (isMobile) return displayPosition === 0 ? 1 : 0;
    if (isTablet) return displayPosition <= 3 ? 1 : 0;
    return displayPosition <= 6 ? 1 : 0;
  };

  // Construct display sequence starting from index -1 (viewed card sliding out left)
  const displayItems = [];
  const startOffset = -1; // include 1 viewed slide for exit animation
  for (let i = startOffset; i < total + startOffset; i++) {
    const idx = (activeIndex + i + total) % total;
    displayItems.push({
      program: programs[idx],
      originalIndex: idx,
      displayPosition: i
    });
  }

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16 relative">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-600 font-body leading-relaxed">
              Accelerate your engineering credentials. Explore our flagship upskilling courses.
            </p>
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-[4px]"
                aria-label="Previous Program"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-[4px]"
                aria-label="Next Program"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Flat Horizontal Flex Container for Squeezy Slider */}
        <div className="mt-6 flex flex-row h-[200px] sm:h-[280px] md:h-[340px] w-full items-stretch overflow-hidden select-none">
          {displayItems.map(({ program, originalIndex, displayPosition }) => {
            const progImage = getProgramImage(program);
            const isClickable = displayPosition > 0 && getCardOpacity(displayPosition) > 0;
            
            return (
              <motion.div
                key={program.id}
                animate={{
                  width: getCardWidth(displayPosition),
                  marginRight: getCardMargin(displayPosition),
                  opacity: getCardOpacity(displayPosition)
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 26
                }}
                className={`relative h-full shrink-0 overflow-hidden border border-slate-200/80 rounded-[4px] bg-slate-50 ${
                  isClickable ? "hover:border-primary cursor-pointer group" : ""
                }`}
                onClick={isClickable ? () => handleSelect(originalIndex) : undefined}
              >
                {/* Program image crop */}
                {progImage ? (
                  <img
                    src={progImage}
                    alt={program.title}
                    className={`absolute inset-0 w-full h-full object-cover ${
                      isClickable ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <GraduationCap className="h-16 w-16 text-slate-300" />
                  </div>
                )}

                {/* Dark preview overlay */}
                {displayPosition > 0 && (
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                )}

                {/* Category Tag on the Active Card only */}
                {displayPosition === 0 && (
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm z-10 select-none">
                    {program.category?.name || "Upskilling"}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Text Section Below Image Block: Fades in/out in place */}
        <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl h-[90px] md:h-[110px] relative overflow-hidden flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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

          {/* Explore All CTA Button */}
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
