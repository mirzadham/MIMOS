"use client";

import React, { useState, useEffect, useRef } from "react";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      quote: "MIMOS Academy transformed my career with practical, hands-on training that gave me the confidence to succeed.",
      name: "Sarah Lim",
      role: "Software Engineer",
      company: "TechNova Solutions"
    },
    {
      quote: "The expert instructors at MIMOS made complex topics easy to understand, and the mentorship was invaluable.",
      name: "James Wong",
      role: "Data Analyst",
      company: "Insight Analytics"
    },
    {
      quote: "I landed my dream job thanks to the skills and certifications I gained through MIMOS Academy’s top-notch programmes.",
      name: "Aisha Rahman",
      role: "Cybersecurity Specialist",
      company: "SecureNet Global"
    },
    {
      quote: "MIMOS doesn’t just teach theory—they focus on real-world applications that make a real difference in the job market.",
      name: "Daniel Tan",
      role: "AI Developer",
      company: "FutureTech Innovations"
    },
    {
      quote: "Enrolling in MIMOS Academy was the best decision I made for my career—highly recommended for technical professionals.",
      name: "Priya Kumar",
      role: "Systems Architect",
      company: "GrowthWave Digital"
    }
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isClientMobile, setIsClientMobile] = useState(false);

  // Resize and measurement handling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      setIsClientMobile(window.innerWidth < 768);
    }, 0);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      setIsClientMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-rotation effect: changes every 6 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const cardWidth = isClientMobile ? 300 : 420;
  const gap = isClientMobile ? 16 : 32;

  // Calculate the track offset to center the active card perfectly
  const offset = (containerWidth - cardWidth) / 2 - activeIndex * (cardWidth + gap);

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#f3eff6] via-[#eae5ee] to-[#e3dbe7] py-20 sm:py-28">
      {/* Premium subtle orchid glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,33,144,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute left-1/4 top-10 -z-10 h-72 w-72 rounded-full bg-primary/4 blur-[100px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-10 -z-10 h-72 w-72 rounded-full bg-slate-300/40 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What Our Graduates Say
          </h2>
          <p className="text-sm sm:text-md text-slate-600 leading-relaxed font-body">
            Discover how MIMOS Academy helps professionals upskill, build career confidence, and achieve engineering leadership.
          </p>
        </div>

        {/* Dynamic Sliding Carousel Track */}
        <div className="mt-16 relative w-full overflow-hidden py-10 select-none" ref={containerRef}>
          <motion.div
            className="flex items-center"
            style={{ gap: `${gap}px` }}
            animate={{ 
              x: isMounted ? offset : 0,
              opacity: isMounted ? 1 : 0
            }}
            initial={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          >
            {items.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={item.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                  animate={{
                    scale: isActive ? 1.05 : 0.9,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  className={`relative p-8 sm:p-10 rounded-2xl cursor-pointer flex flex-col justify-between min-h-[340px] transition-colors duration-500 ${
                    isActive
                      ? "bg-white border border-slate-100 text-slate-900 shadow-[0_15px_30px_-5px_rgba(167,33,144,0.08)]"
                      : "bg-slate-100/90 border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {isActive && (
                    <Quote className="absolute right-6 top-6 h-12 w-12 text-primary/10 pointer-events-none" />
                  )}
                  
                  <div>
                    <div className={`flex gap-1 mb-5 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${isActive ? "fill-amber-400 text-amber-400" : "fill-slate-300 text-slate-300"}`} />
                      ))}
                    </div>
                    <p className={`font-body leading-relaxed italic transition-colors duration-300 ${
                      isActive ? "text-slate-800 text-base sm:text-lg font-semibold" : "text-slate-600 text-sm font-medium line-clamp-5"
                    }`}>
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className={`mt-8 pt-5 border-t transition-colors duration-500 ${isActive ? "border-slate-100" : "border-slate-200"}`}>
                    <h4 className={`font-heading text-sm font-bold transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.role} at <span className={`font-bold transition-colors duration-300 ${isActive ? "text-primary" : "text-slate-600"}`}>{item.company}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dot Indicators */}
        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
                style={{ borderRadius: "9999px" }}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
