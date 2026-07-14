"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface Stat {
  id?: string;
  number: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  // Parse out number and non-numeric suffixes (e.g. "150,000+" -> number: 150000, suffix: "+")
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(easedProgress * numericPart);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericPart);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, numericPart]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="bg-background py-12 border-b border-slate-200/60 relative overflow-hidden">
      {/* Subtle structural background dot pattern */}
      <div className="absolute inset-0 -z-10 placeholder-image opacity-30" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-3 text-center py-2">
          {stats.map((stat, idx) => (
            <div 
              key={stat.id || idx} 
              className="flex flex-col items-center space-y-1.5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="font-heading text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
                <AnimatedNumber value={stat.number} />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider font-sans">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
