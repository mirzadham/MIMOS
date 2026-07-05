"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Bell,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  Newspaper,
  ArrowUpRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface FeaturedStory {
  id: number;
  category: string;
  title: string;
  image: string;
  barColor: string;        // progress-bar gradient
  tagColor: string;        // category vertical-bar color
}

const featuredStories: FeaturedStory[] = [
  {
    id: 1,
    category: "News",
    title:
      "MIMOS cleanroom upgrade unlocks advanced lithography capabilities for 180nm process",
    image: "/semiconductor_cleanroom.png",
    barColor: "linear-gradient(90deg, #ffe5f9, #ffbde8)",
    tagColor: "#ff26b9",
  },
  {
    id: 2,
    category: "News",
    title:
      "Corporate HRD Corp Claimable status now active for all upskilling programmes",
    image: "/training_seminar_room.png",
    barColor: "linear-gradient(90deg, #ffbde8, #ff8ae2)",
    tagColor: "#ff26b9",
  },
  {
    id: 3,
    category: "News",
    title:
      "Generative AI LLM Enterprise Deployment runs starting next cohort",
    image: "/ai_5g_hub.png",
    barColor: "linear-gradient(90deg, #ff8ae2, #ff47cb)",
    tagColor: "#ff26b9",
  },
  {
    id: 4,
    category: "News",
    title:
      "IC Design & layout verification certification tracks now open for enrollment",
    image: "/images/programs/cmosamplifierdesign.webp",
    barColor: "linear-gradient(90deg, #ff47cb, #ff00aa)",
    tagColor: "#ff26b9",
  },
];

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  desc: string;
  image: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "MIMOS semiconductor technology cleanroom upgrades completed",
    category: "Facilities Update",
    date: "20 June 2026",
    desc: "Our Wafer Fab lab has been upgraded with state-of-the-art lithography chambers to support advanced deep-tech microelectronics internship tracks starting next batch.",
    image: "/semiconductor_cleanroom.png",
  },
  {
    id: 2,
    title: "Corporate HRD Corp Claimable status active",
    category: "Administration",
    date: "15 May 2026",
    desc: "All upskilling programs under MIMOS Academy are officially claiming-enabled. Corporate groups can claim training costs directly through HRD Corp.",
    image: "/training_seminar_room.png",
  },
  {
    id: 3,
    title: "PMP hybrid Agile frameworks alignment completed",
    category: "Syllabus Update",
    date: "2 April 2026",
    desc: "Our Project Management courses have been updated to reflect the latest agile methodologies in PMBOK Guide 7th Edition.",
    image: "/images/programs/cmosamplifierdesign.webp",
  },
  {
    id: 4,
    title: "Generative AI LLM Enterprise Deployment track launched",
    category: "Syllabus Update",
    date: "18 March 2026",
    desc: "A brand-new hands-on learning track covering private fine-tuning, retrieval-augmented generation (RAG), and quantization strategies.",
    image: "/ai_5g_hub.png",
  },
  {
    id: 5,
    title: "IC Design & layout verification program certified",
    category: "Certifications",
    date: "28 February 2026",
    desc: "Our analog and digital IC layout training programs have been officially certified by leading global fabless semiconductor design houses.",
    image: "/images/programs/cmosamplifierdesign.webp",
  },
  {
    id: 6,
    title: "Cyber Security Range training lab upgrade completed",
    category: "Facilities Update",
    date: "15 January 2026",
    desc: "Upgraded our cybersecurity simulation range with real-time multi-vector threat injection tools.",
    image: "/semiconductor_cleanroom.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "news">("overview");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* News tab filters */
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const SLIDE_DURATION = 6000;

  /* Auto-advance carousel ------------------------------------------------ */
  useEffect(() => {
    if (isPaused || activeTab !== "overview") return;

    const timer = setTimeout(() => {
      setActiveSlide((s) => (s + 1) % featuredStories.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [isPaused, activeSlide, activeTab]);

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
    const q = searchQuery.toLowerCase();
    const searchOk =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q);
    return catOk && searchOk;
  });

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
            className="text-[15px] font-semibold text-[#ff26b9] tracking-[-0.01em] hover:text-black transition-colors duration-200"
          >
            Newsroom
          </Link>

          {/* Right: Tabs */}
          <nav className="flex items-center gap-7">
            <button
              onClick={() => setActiveTab("overview")}
              className={`relative text-[15px] font-semibold tracking-[-0.01em] transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "text-[#0a2540]"
                  : "text-[#ff26b9] hover:text-[#0a2540]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`relative text-[15px] font-semibold tracking-[-0.01em] transition-colors cursor-pointer ${
                activeTab === "news"
                  ? "text-[#0a2540]"
                  : "text-[#ff26b9] hover:text-[#0a2540]"
              }`}
            >
              News
            </button>
          </nav>
        </div>

        {/* ================================================================ */}
        {/*  OVERVIEW TAB                                                     */}
        {/* ================================================================ */}
        {activeTab === "overview" && (
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
                  {featuredStories.map((story, i) => (
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
                            className="block h-[18px] w-[3px] rounded-full"
                            style={{ backgroundColor: story.tagColor }}
                          />
                          <span className="text-[13px] font-semibold text-[#ff26b9] tracking-wide">
                            {story.category}
                          </span>
                        </div>

                        {/* Headline */}
                        <Link href="#" className="block hover:opacity-60 transition-opacity duration-200">
                          <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold leading-[1.12] tracking-[-0.025em] text-[#0a2540]">
                            {story.title}
                          </h1>
                        </Link>

                        {/* Read more */}
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#ff26b9] hover:text-black transition-colors duration-200 group"
                        >
                          Read more
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                      </div>

                      {/* Right: image with proper shadow container */}
                      <div className="relative aspect-[16/12] w-full bg-[#f6f9fc] rounded-xl shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15),0_18px_36px_-18px_rgba(0,0,0,0.1)]">
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
              <div className="relative h-[4px] group-hover/progress:h-[6px] w-full bg-[#e6ebf1] rounded-full transition-all duration-200">
                {/* Fixed-width colored bar that slides to active position */}
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${100 / featuredStories.length}%`,
                    left: `${(activeSlide / featuredStories.length) * 100}%`,
                    background: featuredStories[activeSlide].barColor,
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
                <h2 className="text-[36px] font-extrabold tracking-tight text-[#0a2540]">
                  News
                </h2>
                <button
                  onClick={() => setActiveTab("news")}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#ff26b9] hover:text-black transition-colors duration-200 group cursor-pointer"
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
                      <span className="block w-[1.5px] h-[14px] bg-[#ff26b9] shrink-0 mt-[4px]" />
                      <span className="text-[15px] font-semibold text-[#425466] tracking-tight">
                        {art.date}
                      </span>
                    </div>

                    {/* Column 2: Category + Title */}
                    <div className="md:col-span-6 flex items-start gap-3">
                      <span className="block w-[1.5px] h-[14px] bg-[#ff26b9] shrink-0 mt-[4px]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[15px] font-semibold text-[#ff26b9]">
                          {art.category}
                        </span>
                        <Link href="#" className="block text-[#0a2540] hover:text-black hover:opacity-60 transition-all duration-200">
                          <h3 className="text-[18px] font-semibold leading-snug">
                            {art.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Image */}
                    <div className="md:col-span-3 flex justify-end md:justify-start">
                      <Link href="#" className="block w-full max-w-[240px]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#f6f9fc] shadow-[0_10px_30px_-5px_rgba(50,50,93,0.08),0_6px_16px_-8px_rgba(0,0,0,0.05)]">
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
        {activeTab === "news" && (
          <div className="pt-10 pb-16 space-y-10">
            {/* Title */}
            <div className="space-y-6">
              <h2 className="text-[36px] font-extrabold tracking-tight text-[#0a2540]">
                News
              </h2>

              {/* Filters (Clean inline tags matching reference image) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#e6ebf1]/10">
                {categories.map((c) => {
                  const label = c === "All" ? "Latest" : c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`whitespace-nowrap px-4 py-1.5 text-[15px] font-semibold transition-all duration-200 cursor-pointer rounded-full hover:opacity-60 ${
                        selectedCategory === c
                          ? "bg-[#ff26b9] text-white shadow-sm"
                          : "text-[#425466]"
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
                      <span className="block w-[1.5px] h-[14px] bg-[#ff26b9] shrink-0 mt-[4px]" />
                      <span className="text-[15px] font-semibold text-[#425466] tracking-tight">
                        {art.date}
                      </span>
                    </div>

                    {/* Column 2: Category + Title */}
                    <div className="md:col-span-6 flex items-start gap-3">
                      <span className="block w-[1.5px] h-[14px] bg-[#ff26b9] shrink-0 mt-[4px]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[15px] font-semibold text-[#ff26b9]">
                          {art.category}
                        </span>
                        <Link href="#" className="block text-[#0a2540] hover:text-black hover:opacity-60 transition-all duration-200">
                          <h3 className="text-[18px] font-semibold leading-snug">
                            {art.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Image */}
                    <div className="md:col-span-3 flex justify-end md:justify-start">
                      <Link href="#" className="block w-full max-w-[240px]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#f6f9fc] shadow-[0_10px_30px_-5px_rgba(50,50,93,0.08),0_6px_16px_-8px_rgba(0,0,0,0.05)]">
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
                <Newspaper className="h-10 w-10 text-[#c1c9d2] mx-auto" />
                <p className="text-[15px] font-semibold text-[#0a2540]">
                  No articles found
                </p>
                <p className="text-[13px] text-[#425466]">
                  Try selecting a different filter.
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-[13px] font-semibold text-[#ff26b9] hover:underline cursor-pointer"
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
