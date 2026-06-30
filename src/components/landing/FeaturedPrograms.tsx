"use client";

import { useState, useEffect, useRef } from "react";
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

/* ─────────────────────────────────────────────────
 * Preview strip sizing constants
 * Matching Stripe "What's happening" proportions
 * ───────────────────────────────────────────────── */
const DESKTOP = {
  widths: [96, 52, 28, 8, 8, 8],
  margins: [12, 12, 12, 6, 6, 0],
  activeMargin: 12,
  count: 6,
};

const TABLET = {
  widths: [80, 44, 24],
  margins: [12, 12, 0],
  activeMargin: 12,
  count: 3,
};

type SizingConfig = typeof DESKTOP;

/** Compute the active card width by subtracting total preview strip space from the container. */
function calcActiveWidth(containerW: number, cfg: SizingConfig): number {
  const stripTotal = cfg.widths.reduce((a, b) => a + b, 0);
  const gapTotal = cfg.margins.reduce((a, b) => a + b, 0) + cfg.activeMargin;
  return Math.max(200, containerW - stripTotal - gapTotal);
}

/* ─────────────────────────────────────────────────
 * CSS transition easing
 *
 * cubic-bezier(0.16, 1, 0.3, 1) = "expo ease-out"
 * Fast start → gentle stop, close to Stripe's
 * per-frame lerp deceleration.
 * ───────────────────────────────────────────────── */
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const DURATION_MS = 1200;

const getProgramImage = (program: Program): string => {
  if (program.imageUrls && program.imageUrls.length > 0) {
    return program.imageUrls[0];
  }
  if (program.imageUrl) {
    return program.imageUrl;
  }

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
    "pmp-certification-training": "/images/programs/pmp.webp",
  };

  return fallbackImages[program.slug] || "/images/programs/wafer-fabrication.webp";
};

/* ═══════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════ */
export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Measure the actual carousel container width ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Enable CSS transitions only after the first paint ── */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!programs || programs.length === 0) return null;

  const total = programs.length;
  const activeProgram = programs[activeIndex];

  const handlePrev = () => setActiveIndex((p) => (p - 1 + total) % total);
  const handleNext = () => setActiveIndex((p) => (p + 1) % total);
  const handleSelect = (idx: number) => setActiveIndex(idx);

  /* ── Responsive breakpoints based on container width ── */
  const isMobile = containerWidth > 0 && containerWidth < 600;
  const isTablet = containerWidth >= 600 && containerWidth < 800;
  const cfg: SizingConfig | null = isMobile ? null : isTablet ? TABLET : DESKTOP;
  const maxVisible = cfg ? cfg.count : 0;
  const activeW =
    containerWidth > 0
      ? cfg
        ? calcActiveWidth(containerWidth, cfg)
        : containerWidth
      : 0;

  /* The fixed pixel width every image is rendered at.
   * This never changes during transitions — the card
   * container clips/reveals the image as it squeezes. */
  const imageFixedWidth = Math.max(activeW, 300);

  /* ── Compute inline styles for each card ──
   *
   * FIXED DOM ORDER: programs render [0, 1, …, N-1].
   * Same DOM elements always, so CSS transitions work.
   *
   * Display position = (i - activeIndex + total) % total
   *   0  → active (wide)
   *   1–maxVisible → visible preview strips
   *   >maxVisible → hidden (width 0, shrunk out)
   */
  const getCardStyle = (programIndex: number): React.CSSProperties => {
    const pos = (programIndex - activeIndex + total) % total;

    let width = 0;
    let mr = 0;
    let opacity = 0;
    let blur = 0;

    if (pos === 0) {
      width = activeW;
      mr = cfg ? cfg.activeMargin : 0;
      opacity = 1;
    } else if (cfg && pos >= 1 && pos <= maxVisible) {
      const pi = pos - 1;
      width = cfg.widths[pi];
      mr = cfg.margins[pi];
      opacity = 1;
      // Subtle blur on the thinnest strips (like Stripe)
      if (pos >= 4) blur = 2;
    }

    const isHidden = width === 0;

    return {
      width,
      marginRight: mr,
      opacity,
      flexShrink: 0,
      overflow: "hidden",
      // Remove border + padding on hidden cards so nothing is visible
      borderWidth: isHidden ? 0 : 1,
      padding: isHidden ? 0 : undefined,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      transition: isReady
        ? [
            `width ${DURATION_MS}ms ${EASING}`,
            `margin-right ${DURATION_MS}ms ${EASING}`,
            `border-width ${DURATION_MS}ms ${EASING}`,
            `opacity 500ms ease`,
            `filter 400ms ease`,
          ].join(", ")
        : "none",
    };
  };

  const getDisplayPos = (i: number) =>
    (i - activeIndex + total) % total;

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16 relative">
        {/* ── Section Header ── */}
        <div className="flex flex-row items-end justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-600 font-body leading-relaxed">
              Accelerate your engineering credentials. Explore our flagship
              upskilling courses.
            </p>
          </div>

          {total > 1 && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-[4px]"
                aria-label="Previous Programme"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-[4px]"
                aria-label="Next Programme"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Squeezy Accordion Carousel ──
         *
         * HOW THE IMAGE REVEAL WORKS:
         * Each <img> is rendered at a FIXED width (= active card width),
         * centered inside its card container via left:50% + translateX(-50%).
         * The card has overflow:hidden and its width is animated via CSS.
         *
         * When the card is narrow (e.g. 8px), only 8px of the center of
         * the full-size image is visible. As the card widens, more of the
         * image is progressively REVEALED — like a curtain opening.
         * The image itself NEVER scales.
         *
         * HOW THE SLIDING MOTION WORKS:
         * All cards are in a flex row. When activeIndex changes, every
         * card's width transitions simultaneously. Cards before the active
         * one shrink to 0px, releasing space. The active card expands to
         * fill that space. This causes all cards to physically shift left
         * or right together — like someone pushing the entire row of cards.
         */}
        <div
          ref={containerRef}
          className="flex flex-row h-[200px] sm:h-[280px] md:h-[340px] w-full items-stretch overflow-hidden select-none"
        >
          {programs.map((program, i) => {
            const pos = getDisplayPos(i);
            const isActive = pos === 0;
            const isClickable = pos >= 1 && pos <= maxVisible;
            const progImage = getProgramImage(program);

            return (
              <div
                key={program.id}
                style={getCardStyle(i)}
                className={`relative h-full rounded-[4px] border border-slate-200/80 bg-slate-50 ${
                  isClickable
                    ? "hover:border-primary cursor-pointer group"
                    : ""
                }`}
                onClick={isClickable ? () => handleSelect(i) : undefined}
              >
                {/* IMAGE: Fixed width, centered, clipped by card.
                 * The image NEVER scales — only more/less of it is visible
                 * as the card container widens or narrows. */}
                {progImage ? (
                  <img
                    src={progImage}
                    alt={program.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: imageFixedWidth,
                      minWidth: imageFixedWidth,
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className={
                      isClickable
                        ? "transition-transform duration-700 ease-out group-hover:scale-105"
                        : ""
                    }
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: imageFixedWidth,
                      minWidth: imageFixedWidth,
                      height: "100%",
                    }}
                    className="flex items-center justify-center bg-slate-50"
                  >
                    <GraduationCap className="h-16 w-16 text-slate-300" />
                  </div>
                )}

                {/* Subtle dark overlay on preview strips */}
                {isClickable && (
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                )}

                {/* Ambient gradient on the active card */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                )}

                {/* Category tag — active card only */}
                {isActive && (
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm z-10 select-none">
                    {program.category?.name || "Upskilling"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Text Details — fades in place (no sliding) ── */}
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
                <Link
                  href={`/programs/${activeProgram.slug}`}
                  className="group/title inline-block"
                >
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
