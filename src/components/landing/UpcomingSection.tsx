"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  imageUrl: string | null;
}

interface UpcomingSectionProps {
  articles: NewsArticle[];
}

export default function UpcomingSection({ articles }: UpcomingSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Take the 6 latest news articles
  const displayArticles = (articles || []).slice(0, 6);

  // Update navigation button states on scroll
  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    setIsStart(container.scrollLeft <= 5);
    setIsEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, displayArticles.length]);

  // Scroll function for buttons
  const scroll = (direction: "prev" | "next") => {
    const container = carouselRef.current;
    if (!container) return;

    const cardElement = container.querySelector("[data-carousel-card]");
    const cardWidth = cardElement ? cardElement.clientWidth : 457;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "prev" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200/60 overflow-hidden">
      {/* Self-contained style block to hide scrollbars cleanly and set responsive layout paddings */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .carousel-container {
            padding-left: 24px;
            padding-right: 24px;
            scroll-padding-left: 24px;
          }
          
          @media (min-width: 1024px) {
            .carousel-container {
              padding-left: max(80px, calc((100vw - 1600px) / 2 + 80px));
              padding-right: max(80px, calc((100vw - 1600px) / 2 + 80px));
              scroll-padding-left: max(80px, calc((100vw - 1600px) / 2 + 80px));
            }
          }
        `
      }} />

      {/* Header Row */}
      <div className="mx-auto max-w-[1600px] w-full px-6 lg:px-20 flex items-end justify-between">
        <div className="flex items-baseline gap-4 md:gap-5">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black leading-none">
            Latest News
          </h2>
          <Link
            href="/news"
            className="group inline-flex items-center gap-1 text-sm md:text-base font-semibold text-primary hover:opacity-70 transition-opacity duration-200"
          >
            <span>View All</span>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        {/* Text Navigation */}
        <div className="flex items-center gap-20">
          <button
            onClick={() => scroll("prev")}
            disabled={isStart}
            type="button"
            className={`text-sm md:text-base font-semibold transition-opacity duration-200 cursor-pointer ${isStart ? "opacity-30 pointer-events-none text-primary" : "text-primary hover:opacity-60"
              }`}
          >
            Prev.
          </button>
          <button
            onClick={() => scroll("next")}
            disabled={isEnd}
            type="button"
            className={`text-sm md:text-base font-semibold transition-opacity duration-200 cursor-pointer ${isEnd ? "opacity-30 pointer-events-none text-primary" : "text-primary hover:opacity-60"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Carousel Area */}
      <div className="relative mt-10 w-full">
        <div
          ref={carouselRef}
          className="carousel-container flex overflow-x-auto snap-x snap-mandatory gap-[20px] no-scrollbar scroll-smooth w-full"
        >
          {displayArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              data-carousel-card
              className="group flex flex-col w-[85vw] md:w-[457px] flex-shrink-0 snap-start select-none cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[12px] md:rounded-[16px] bg-slate-100 relative">
                <Image
                  src={article.imageUrl || "/semiconductor_cleanroom.png"}
                  alt="News Cover"
                  fill
                  className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-w-768px) 85vw, 457px"
                  priority={index === 0 || index === 1}
                />
              </div>

              {/* Content Stack */}
              <div className="flex flex-col gap-4 mt-6">
                <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-primary leading-none font-sans line-clamp-2">
                  {article.title}
                </span>
                <h3 className="text-sm md:text-base font-semibold text-black leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                  {article.description}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
