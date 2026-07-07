"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

export default function UpcomingSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);


  const events: EventItem[] = [
    {
      id: "event-1",
      category: "SEMICONDUCTORS • INTAKE SCHEDULED SOON",
      title: "Advance your engineering skills with our upcoming Semiconductor Wafer Fabrication intake. Learn cleanroom protocols, photolithography, and microfabrication processes in MIMOS's advanced R&D labs.",
      image: "/images/programs/wafer-fabrication.webp",
      link: "/programs/semiconductor-wafer-fabrication"
    },
    {
      id: "event-2",
      category: "ARTIFICIAL INTELLIGENCE • JULY 2026",
      title: "Become a Certified Data Science Practitioner in July 2026. This comprehensive program covers machine learning pipelines, predictive modeling, and data engineering workflows on production-grade infrastructure.",
      image: "/images/programs/certified-data-science-practitioner-1.webp",
      link: "/programs/certified-data-science-practitioner"
    },
    {
      id: "event-3",
      category: "CYBERSECURITY • SCHEDULED SOON",
      title: "Protect national infrastructure and enterprise networks. Our upcoming Cybersecurity Awareness intake prepares IT professionals to identify vulnerabilities, mitigate risks, and respond to threats.",
      image: "/images/programs/cybersecurity-1.webp",
      link: "/programs/cybersecurity-awareness"
    },
    {
      id: "event-4",
      category: "WEBINAR • 12TH JULY 2026",
      title: "Semiconductor Workforce Development Briefing for HR leaders. Discover how to leverage HRD Corp levies for deep-tech upskilling, cleanroom competency certifications, and advanced engineering programs.",
      image: "/images/programs/electrical-engineering-1.webp",
      link: "/contact"
    },
    {
      id: "event-5",
      category: "PHYSICAL EVENT • 05TH AUGUST 2026",
      title: "Join the MIMOS Academy Open Day & Lab Tour. Get direct access to preview our state-of-the-art semiconductor cleanrooms, 5G innovation labs, and speak directly with our senior research scientists.",
      image: "/semiconductor_cleanroom.png",
      link: "/contact"
    },
    {
      id: "event-6",
      category: "DEVELOPER WORKFLOWS • END OF MAY 2026",
      title: "Master vibe-coding workflows using GitHub Copilot and Google Antigravity. Automate boilerplate generation, conduct AI-assisted refactoring, and accelerate your development lifecycle.",
      image: "/images/programs/vibe-coding-1.webp",
      link: "/programs/mastering-vibe-coding"
    }
  ];



  // Update navigation button states on scroll
  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;

    setIsStart(container.scrollLeft <= 5);
    setIsEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 5);
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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
          <h2 className="font-sans text-2xl md:text-[28px] font-bold tracking-tight text-black leading-none">
            Latest Events
          </h2>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1 text-sm md:text-base font-normal text-primary hover:opacity-70 transition-opacity duration-200"
          >
            <span>View All</span>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        </div>

        {/* Text Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => scroll("prev")}
            disabled={isStart}
            type="button"
            className={`text-sm md:text-base font-medium transition-opacity duration-200 cursor-pointer ${
              isStart ? "opacity-30 pointer-events-none text-primary" : "text-primary hover:opacity-60"
            }`}
          >
            Prev.
          </button>
          <button
            onClick={() => scroll("next")}
            disabled={isEnd}
            type="button"
            className={`text-sm md:text-base font-medium transition-opacity duration-200 cursor-pointer ${
              isEnd ? "opacity-30 pointer-events-none text-primary" : "text-primary hover:opacity-60"
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
          {events.map((event) => (
            <Link
              key={event.id}
              href={event.link}
              data-carousel-card
              className="group flex flex-col w-[85vw] md:w-[457px] flex-shrink-0 snap-start select-none cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[12px] md:rounded-[16px] bg-slate-100 relative">
                <Image
                  src={event.image}
                  alt="Event Cover"
                  fill
                  className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-w-768px) 85vw, 457px"
                  priority={event.id === "event-1" || event.id === "event-2"}
                />
              </div>

              {/* Content Stack */}
              <div className="flex flex-col gap-4 mt-6">
                <span className="text-[10px] font-normal uppercase tracking-[0.05em] text-primary leading-none font-sans">
                  {event.category}
                </span>
                <h3 className="text-sm md:text-base font-medium text-black leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                  {event.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
