"use client";

import React, { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      quote: "Mimos Academy transformed my career with practical, hands-on training that gave me the confidence to succeed.",
      name: "Sarah Lim",
      role: "Software Engineer",
      company: "TechNova Solutions"
    },
    {
      quote: "The expert instructors at Mimos made complex topics easy to understand, and the mentorship was invaluable.",
      name: "James Wong",
      role: "Data Analyst",
      company: "Insight Analytics"
    },
    {
      quote: "I landed my dream job thanks to the skills and certifications I gained through Mimos Academy’s top-notch programmes.",
      name: "Aisha Rahman",
      role: "Cybersecurity Specialist",
      company: "SecureNet Global"
    },
    {
      quote: "Mimos doesn’t just teach theory—they focus on real-world applications that make a real difference in the job market.",
      name: "Daniel Tan",
      role: "AI Developer",
      company: "FutureTech Innovations"
    },
    {
      quote: "Enrolling in Mimos Academy was the best decision I made for my career—highly recommended for all of you!!",
      name: "Priya Kumar",
      role: "Digital Marketing Strategist",
      company: "GrowthWave Agency"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="border-b border-slate-100 bg-slate-900 text-white py-16 sm:py-24 overflow-hidden relative">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-gold opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Alumni Reviews
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What People Say About Us
          </h2>
          <p className="text-sm text-slate-400 font-body">
            Discover how MIMOS Academy has helped professionals upskill, gain confidence, and achieve career success.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="relative z-10 rounded-3xl bg-slate-800/80 border border-slate-700/50 p-8 sm:p-12 shadow-2xl backdrop-blur-sm min-h-[300px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Star Rating & Quote Icon */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <Quote className="h-10 w-10 text-primary opacity-30" />
              </div>

              {/* Quote Content */}
              <p className="text-base sm:text-xl font-medium leading-relaxed text-slate-100 italic font-body">
                &ldquo;{testimonials[activeIndex].quote}&rdquo;
              </p>
            </div>

            {/* Author Info */}
            <div className="mt-8 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-heading text-md font-bold text-white">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {testimonials[activeIndex].role} at <span className="text-gold font-medium">{testimonials[activeIndex].company}</span>
                </p>
              </div>

              {/* Slider Navigation Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  className="p-2.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/50 transition-all focus:outline-none"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-2.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/50 transition-all focus:outline-none"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-slate-700"
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
