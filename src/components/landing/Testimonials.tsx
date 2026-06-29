"use client";

import React, { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" as const }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" as const }
    })
  };

  return (
    <section className="border-b border-slate-200/60 bg-white py-20 sm:py-28 overflow-hidden relative">
      {/* Decorative layout elements */}
      <div className="absolute left-10 top-10 -z-10 h-72 w-72 rounded-full bg-primary/3 blur-[100px] pointer-events-none" />
      <div className="absolute right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-slate-100 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
            Alumni Success
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What Our Graduates Say
          </h2>
          <p className="text-sm sm:text-md text-slate-500 leading-relaxed font-body">
            Discover how MIMOS Academy helps professionals upskill, build career confidence, and achieve engineering leadership.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="relative z-10 rounded-3xl border border-slate-200/80 bg-slate-50/30 p-8 sm:p-14 shadow-neon-light hover:shadow-neon-hover hover:border-primary/10 transition-all duration-300 min-h-[340px] flex flex-col justify-between overflow-hidden">
            
            {/* Top Row: Star Rating & Quote Icon */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="h-10 w-10 text-primary/15" />
            </div>

            {/* Quote Content with Animating Presence */}
            <div className="flex-1 relative flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <p className="text-lg sm:text-2xl font-semibold leading-relaxed text-slate-800 italic font-body">
                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Author Info & Navigation Controls */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h4 className="font-heading text-md font-bold text-slate-900">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {testimonials[activeIndex].role} at <span className="text-primary font-bold">{testimonials[activeIndex].company}</span>
                </p>
              </div>

              {/* Slider Navigation Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/20 hover:shadow-sm transition-all focus:outline-none cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/20 hover:shadow-sm transition-all focus:outline-none cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
