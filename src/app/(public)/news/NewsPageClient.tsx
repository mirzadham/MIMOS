"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Newspaper,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FeaturedStory {
  id: string;
  category: string;
  title: string;
  image: string;
  barColor: string;
  tagColor: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  desc: string;
  image: string;
}

interface NewsPageClientProps {
  articles: Article[];
  featuredStories: FeaturedStory[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NewsPageClient({ articles, featuredStories }: NewsPageClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "news">("overview");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* News tab filters */
  const [selectedCategory, setSelectedCategory] = useState("All");

  const SLIDE_DURATION = 6000;

  /* Switch active tab if query parameter tab=news is provided -------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "news") {
        setTimeout(() => {
          setActiveTab("news");
        }, 0);
      }
    }
  }, []);

  /* Auto-advance carousel ------------------------------------------------ */
  useEffect(() => {
    if (isPaused || activeTab !== "overview" || featuredStories.length === 0) return;

    const timer = setTimeout(() => {
      setActiveSlide((s) => (s + 1) % featuredStories.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [isPaused, activeSlide, activeTab, featuredStories.length]);

  const goTo = useCallback((i: number) => {
    setActiveSlide(i);
  }, []);

  /* News-tab helpers ------------------------------------------------------ */
  const categories = [
    "All",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ];

  const filtered = articles.filter((a) => {
    const catOk =
      selectedCategory === "All" || a.category === selectedCategory;
    return catOk;
  });

  /* Guard: if no featured stories, show news tab only */
  const hasFeatured = featuredStories.length > 0;

  /* ----- render --------------------------------------------------------- */
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* ── Page content container ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1080px] px-6 lg:px-8">
        {/* ─── Top nav bar: "Newsroom" + tabs ────────────────────────── */}
        <div className="flex items-center justify-between py-5">
          {/* Left: Newsroom label */}
          <Link
            href="/news"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("overview");
            }}
            className="text-[15px] font-semibold text-primary tracking-[-0.01em] hover:text-slate-900 transition-colors duration-200"
          >
            Newsroom
          </Link>

          {/* Right: Tabs */}
          <nav className="flex items-center gap-7">
            {hasFeatured && (
              <button
                onClick={() => setActiveTab("overview")}
                className={`relative text-[15px] font-semibold tracking-[-0.01em] transition-colors cursor-pointer ${activeTab === "overview"
                  ? "text-slate-900"
                  : "text-primary hover:text-slate-900"
                  }`}
              >
                Overview
              </button>
            )}
            <button
              onClick={() => setActiveTab("news")}
              className={`relative text-[15px] font-semibold tracking-[-0.01em] transition-colors cursor-pointer ${activeTab === "news"
                ? "text-slate-900"
                : "text-primary hover:text-slate-900"
                }`}
            >
              News
            </button>
          </nav>
        </div>

        {/* ================================================================ */}
        {/*  OVERVIEW TAB                                                     */}
        {/* ================================================================ */}
        {activeTab === "overview" && hasFeatured && (
          <>
            {/* ─── Hero carousel ─────────────────────────────────────── */}
            <section
              className="pt-12 pb-0"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Film strip: all slides in a row, shifted by translateX */}
              <div className="overflow-hidden -mx-6 md:-mx-10 lg:-mx-16 pt-3 pb-7">
                <div
                  className="flex min-h-[385px]"
                  style={{
                    width: `${featuredStories.length * 100}%`,
                    transform: `translateX(-${activeSlide * (100 / featuredStories.length)}%)`,
                    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {featuredStories.map((story) => (
                    <div
                      key={story.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start px-6 md:px-10 lg:px-16"
                      style={{ width: `${100 / featuredStories.length}%` }}
                    >
                      {/* Left: text */}
                      <div className="flex flex-col gap-6">
                        {/* Category tag with vertical bar */}
                        <div className="flex items-center gap-2.5">
                          <span
                            className="block h-[15px] w-[1px] rounded-full"
                            style={{ backgroundColor: story.tagColor }}
                          />
                          <span className="text-[13px] font-semibold text-primary tracking-wide">
                            {story.category}
                          </span>
                        </div>

                        {/* Headline */}
                        <Link href={`/news/${story.id}`} className="block hover:opacity-60 transition-opacity duration-200">
                          <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold leading-[1.12] tracking-[-0.025em] text-slate-900">
                            {story.title}
                          </h2>
                        </Link>

                        {/* Read more */}
                        <Link
                          href={`/news/${story.id}`}
                          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:text-slate-900 transition-colors duration-200 group"
                        >
                          Read more
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                      </div>

                      {/* Right: image with proper shadow container */}
                      <div className="relative aspect-[16/12] w-full bg-slate-50 rounded-xl shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15),0_18px_36px_-18px_rgba(0,0,0,0.1)]">
                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─── Sliding progress bar with grey background track ─────── */}
            <div className="relative group/progress cursor-pointer mt-2 h-[8px] flex items-center z-20">
              {/* Grey track background that expands by 2px on hover (centered to prevent layout shift) */}
              <div className="relative h-[4px] group-hover/progress:h-[6px] w-full bg-slate-100 rounded-full transition-all duration-200">
                {/* Fixed-width colored bar that slides to active position */}
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${100 / featuredStories.length}%`,
                    left: `${(activeSlide / featuredStories.length) * 100}%`,
                    background: featuredStories[activeSlide]?.barColor,
                    transition: "left 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease",
                  }}
                />
              </div>

              {/* Clickable regions overlay mapping to slides (comfortably sized click targets) */}
              <div className="absolute -top-3 -bottom-3 inset-x-0 flex z-30">
                {featuredStories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="flex-1 h-full cursor-pointer focus:outline-none"
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ─── Below-the-fold content (Matching reference layout) ─── */}
            <div className="pt-10 pb-16 space-y-12">
              {/* Heading section */}
              <div className="space-y-3">
                <h2 className="text-[36px] font-extrabold tracking-tight text-slate-900">
                  News
                </h2>
                <button
                  onClick={() => setActiveTab("news")}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:text-slate-900 transition-colors duration-200 group cursor-pointer"
                >
                  All news
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Articles Row List */}
              <div className="space-y-8 md:space-y-6">
                {articles.slice(0, 6).map((art) => (
                  <div
                    key={art.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start group"
                  >
                    {/* Column 1: Date */}
                    <div className="md:col-span-3 flex items-start gap-3 pt-[3px]">
                      <span className="block w-[1px] h-[14px] bg-primary shrink-0 mt-[4px]" />
                      <span className="text-[15px] font-semibold text-slate-600 tracking-tight">
                        {art.date}
                      </span>
                    </div>

                    {/* Column 2: Category + Title */}
                    <div className="md:col-span-6 flex items-start gap-3">
                      <span className="block w-[1px] h-[14px] bg-primary shrink-0 mt-[4px]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[15px] font-semibold text-primary">
                          {art.category}
                        </span>
                        <Link href={`/news/${art.id}`} className="block text-slate-900 hover:text-primary transition-all duration-200">
                          <h3 className="text-[18px] font-semibold leading-snug">
                            {art.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Image */}
                    <div className="md:col-span-3 flex justify-end md:justify-start">
                      <Link href={`/news/${art.id}`} className="block w-full max-w-[240px]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-50 shadow-[0_10px_30px_-5px_rgba(50,50,93,0.08),0_6px_16px_-8px_rgba(0,0,0,0.05)]">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================================================================ */}
        {/*  NEWS TAB                                                         */}
        {/* ================================================================ */}
        {(activeTab === "news" || (!hasFeatured && activeTab === "overview")) && (
          <div className="pt-10 pb-16 space-y-10">
            {/* Title */}
            <div className="space-y-6">
              <h2 className="text-[36px] font-extrabold tracking-tight text-slate-900">
                News
              </h2>

              {/* Filters (Clean inline tags matching reference image) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/40">
                {categories.map((c) => {
                  const label = c === "All" ? "Latest" : c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`whitespace-nowrap px-4 py-1.5 text-[15px] font-semibold transition-all duration-200 cursor-pointer rounded-full hover:opacity-60 ${selectedCategory === c
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Articles Row List */}
            {filtered.length > 0 ? (
              <div className="space-y-8 md:space-y-6">
                {filtered.map((art) => (
                  <div
                    key={art.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start group"
                  >
                    {/* Column 1: Date */}
                    <div className="md:col-span-3 flex items-start gap-3 pt-[3px]">
                      <span className="block w-[1.5px] h-[14px] bg-primary shrink-0 mt-[4px]" />
                      <span className="text-[15px] font-semibold text-slate-600 tracking-tight">
                        {art.date}
                      </span>
                    </div>

                    {/* Column 2: Category + Title */}
                    <div className="md:col-span-6 flex items-start gap-3">
                      <span className="block w-[1.5px] h-[14px] bg-primary shrink-0 mt-[4px]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[15px] font-semibold text-primary">
                          {art.category}
                        </span>
                        <Link href={`/news/${art.id}`} className="block text-slate-900 hover:text-primary transition-all duration-200">
                          <h3 className="text-[18px] font-semibold leading-snug">
                            {art.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Image */}
                    <div className="md:col-span-3 flex justify-end md:justify-start">
                      <Link href={`/news/${art.id}`} className="block w-full max-w-[240px]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-50 shadow-[0_10px_30px_-5px_rgba(50,50,93,0.08),0_6px_16px_-8px_rgba(0,0,0,0.05)]">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                <Newspaper className="h-10 w-10 text-slate-400 mx-auto" />
                <p className="text-[15px] font-semibold text-slate-900">
                  No articles found
                </p>
                <p className="text-[13px] text-slate-500">
                  Try selecting a different filter.
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
