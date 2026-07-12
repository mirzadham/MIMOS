"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";


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
  widths: [176, 112, 64, 12, 12, 12],
  margins: [12, 12, 12, 6, 6, 0],
  activeMargin: 12,
  count: 6,
};

const TABLET = {
  widths: [140, 88, 48],
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

/** Helper to check if an index lies in a circular range [start, end) */
function isCircularBetween(index: number, start: number, end: number): boolean {
  if (start === end) return false;
  if (start < end) {
    return index >= start && index < end;
  } else {
    return index >= start || index < end;
  }
}

/* ═══════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════ */
export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(activeIndex);

  if (activeIndex !== currentActiveIndex) {
    setPrevActiveIndex(currentActiveIndex);
    setCurrentActiveIndex(activeIndex);
  }

  /* Clean up transition timeouts on unmount */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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


  const startTransition = (newIndex: number, dir: "forward" | "backward") => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setDirection(dir);
    setIsTransitioning(true);
    setActiveIndex(newIndex);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, DURATION_MS);
  };

  const handlePrev = () => {
    startTransition((activeIndex - 1 + total) % total, "backward");
  };

  const handleNext = () => {
    startTransition((activeIndex + 1) % total, "forward");
  };

  const handleSelect = (idx: number) => {
    startTransition(idx, "forward");
  };

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
   * FIXED DOM ORDER + CSS `order`:
   * DOM order is always [0, 1, …, N-1] so CSS transitions work.
   * CSS `order` controls VISUAL order so the active card is always
   * leftmost, preview strips follow to the right, and hidden cards
   * are last. This creates a proper circular loop.
   *
   * When moving forward:
   * Any card in the circular range [prevActiveIndex, activeIndex)
   * is shrinking to 0px. We place them to the left of the new active
   * card (using negative order values) so they pull the new active
   * card leftward.
   */
  const getCardStyle = (programIndex: number, isHovered: boolean): React.CSSProperties => {
    const pos = (programIndex - activeIndex + total) % total;

    // During transition, skipped cards shrink to 0 on the left and do not wrap to the right
    const isExitingLeft =
      direction === "forward" &&
      isCircularBetween(programIndex, prevActiveIndex, activeIndex) &&
      (isTransitioning || !(pos === 0 || (cfg && pos >= 1 && pos <= maxVisible)));

    let width = 0;
    let mr = 0;

    if (isExitingLeft) {
      width = 0;
      mr = 0;
    } else if (pos === 0) {
      // Check if the currently hovered card is a preview strip
      let expansionAmount = 0;
      if (hoveredIndex !== null && cfg) {
        const hoveredPos = (hoveredIndex - activeIndex + total) % total;
        if (hoveredPos >= 1 && hoveredPos <= maxVisible) {
          const pi = hoveredPos - 1;
          const baseWidth = cfg.widths[pi];
          expansionAmount = baseWidth <= 12 ? 10 : 20;
        }
      }
      
      width = activeW - expansionAmount;
      mr = cfg ? cfg.activeMargin : 0;
    } else if (cfg && pos >= 1 && pos <= maxVisible) {
      const pi = pos - 1;
      const baseWidth = cfg.widths[pi];
      const expansionAmount = baseWidth <= 12 ? 10 : 20;
      width = baseWidth + (isHovered ? expansionAmount : 0);
      mr = cfg.margins[pi];
    }

    const isHidden = width === 0;

    // Calculate CSS flex order
    let order = pos;
    if (direction === "forward" && isExitingLeft) {
      const distance = (activeIndex - prevActiveIndex + total) % total;
      const offset = (programIndex - prevActiveIndex + total) % total;
      order = -distance + offset;
    }

    return {
      width,
      marginRight: mr,
      order,
      flexShrink: 0,
      overflow: "hidden",
      // Remove border + padding on hidden cards so they disappear cleanly
      borderWidth: isHidden ? 0 : 1,
      padding: isHidden ? 0 : undefined,
      transition: isReady
        ? [
            `width ${DURATION_MS}ms ${EASING}`,
            `margin-right ${DURATION_MS}ms ${EASING}`,
            `border-width ${DURATION_MS}ms ${EASING}`,
            `transform 800ms ${EASING}`,
          ].join(", ")
        : "none",
    };
  };

  const getDisplayPos = (i: number) =>
    (i - activeIndex + total) % total;

  return (
    <section className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 relative">
        {/* ── Section Header ── */}
        <div className="flex flex-row items-end justify-between pb-4 mb-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Training Programmes
            </h2>
            <p className="text-sm sm:text-md text-slate-600 font-body leading-relaxed">
              Enhance your professional credentials. Explore our flagship upskilling courses.
            </p>
          </div>

          {total > 1 && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-lg"
                aria-label="Previous Programme"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="inline-flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-lg"
                aria-label="Next Programme"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Squeezy Accordion Carousel ── */}
        <div
          ref={containerRef}
          className="flex flex-row h-[280px] sm:h-[380px] md:h-[460px] w-full items-stretch overflow-hidden select-none"
        >
          {programs.map((program, i) => {
            const pos = getDisplayPos(i);
            const isActive = pos === 0;
            const isClickable = pos >= 1 && pos <= maxVisible;
            const isExitingLeft =
              direction === "forward" &&
              isCircularBetween(i, prevActiveIndex, activeIndex) &&
              (isTransitioning || !(pos === 0 || (cfg && pos >= 1 && pos <= maxVisible)));

            const progImage = getProgramImage(program);

            // Determine image anchoring style for directional sliding reveal
            const imgStyle: React.CSSProperties = {
              position: "absolute",
              top: 0,
              width: imageFixedWidth,
              minWidth: imageFixedWidth,
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            };

            if (direction === "forward") {
              if (isExitingLeft) {
                // Anchor to the right, so as the card shrinks to 0, the image slides left out of view
                imgStyle.right = 0;
              } else {
                // Anchor to the left, so the expanding card pulls the image leftward into view
                imgStyle.left = 0;
              }
            } else {
              // Backward transition
              if (i === activeIndex) {
                // New active expanding from left: anchor right, so image slides in from the left
                imgStyle.right = 0;
              } else {
                // Previews shifting right: anchor left, so image slides right
                imgStyle.left = 0;
              }
            }

            return (
              <div
                key={program.id}
                style={getCardStyle(i, hoveredIndex === i)}
                className={`relative h-full rounded-xl border border-slate-200/80 bg-slate-50 ${
                  isClickable
                    ? "cursor-pointer group"
                    : ""
                }`}
                onClick={isClickable ? () => handleSelect(i) : undefined}
                onMouseEnter={isClickable ? () => setHoveredIndex(i) : undefined}
                onMouseLeave={isClickable ? () => setHoveredIndex(null) : undefined}
              >
                {/* IMAGE: Fixed width, dynamically anchored for realistic sliding physics */}
                {progImage ? (
                  <img
                    src={progImage}
                    alt={program.title}
                    style={imgStyle}
                    className={""}
                  />
                ) : (
                  <div
                    style={imgStyle}
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
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-md bg-white/75 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold text-slate-900 border border-white/20 shadow-sm z-10 select-none uppercase tracking-wider">
                    {program.category?.name || "Upskilling"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Text Details — fades in place (no sliding) ── */}
        <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl flex-1 space-y-2">
            <Link
              href={`/programs/${activeProgram.slug}`}
              className="group/title inline-block"
            >
              <h3 className="font-heading text-2xl font-semibold text-slate-900 group-hover/title:text-primary transition-colors leading-snug">
                {activeProgram.title}
              </h3>
            </Link>
            <p className="text-sm sm:text-md text-slate-650 font-body leading-relaxed line-clamp-3">
              {activeProgram.description}
            </p>
          </div>

          <div className="shrink-0 pt-1">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-6 py-3.5 text-xs font-semibold text-white hover:bg-primary-hover transition-all duration-200 group"
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
