"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FacilitiesPage() {
  const facilities = [
    {
      index: "01",
      title: "Semiconductor Technology Centre (STC)",
      subtitle: "Wafer Fabrication & Microelectronics R&D",
      imageUrl: "/semiconductor_cleanroom.png",
      desc: "Malaysia's premier shared R&D fabrication center. Providing hands-on practical training space for engineering cohorts inside advanced cleanroom environments.",
      specs: [
        "Wafer Fabrication: Complete 6-inch wafer processing line",
        "Cleanroom Class: Certified Class 10 to Class 1000 environments",
        "Lithography: Precision E-beam & photolithography systems",
        "Thin Film Deposition: PECVD, LPCVD, and sputtering chambers",
        "Failure Analysis: Scanning electron microscopes (SEM)"
      ]
    },
    {
      index: "02",
      title: "5G & AI Innovation Hub",
      subtitle: "Enterprise Workloads & Generative Modeling",
      imageUrl: "/ai_5g_hub.png",
      desc: "A cooperative facility simulating enterprise workloads. Students train and deploy generative models and verify networking latency in real-world scenarios.",
      specs: [
        "AI Compute: NVIDIA H100 GPU nodes with NVMe SAN storage",
        "Standalone 5G: Private sub-6GHz testbeds for latency testing",
        "Secure Sandbox: Air-gapped model training and verification",
        "IoT Arrays: Comprehensive protocol verification frameworks"
      ]
    },
    {
      index: "03",
      title: "Cyber Security Range",
      subtitle: "Threat Simulation & Incident Response",
      imageUrl: "/cyber_security_range.png",
      desc: "Designed to train cybersecurity groups. The lab runs physical simulations of high-level threat profiles, privilege escalation, and active logging analytics.",
      specs: [
        "Cyber-Range: Active threat simulation and response testing",
        "Network Racks: Modular hardware racks for network virtualization",
        "Packet Capture: Real-time packet inspection and analysis nodes",
        "Verification: Dedicated air-gapped forensic sandboxes"
      ]
    },
    {
      index: "04",
      title: "Training & Seminar Rooms",
      subtitle: "Technical Lecture & Seminars",
      imageUrl: "/training_seminar_room.png",
      desc: "Premium multi-functional spaces tailored for technical training cohorts and executive presentations with state-of-the-art visual hardware.",
      specs: [
        "AV Systems: Interactive smart displays & dual-projector arrays",
        "Dev Terminals: Pre-configured developer stations for students",
        "Conferencing: High-definition audio-visual integration",
        "Seating Capacity: Flexible layouts accommodating up to 60 pax",
        "Power Reliability: Localized UPS backup arrays"
      ]
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((el, index) => {
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          rootMargin: "-30% 0px -40% 0px",
          threshold: 0.1
        }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);

  return (
    <div className="bg-background min-h-screen relative">
      {/* Decorative ambient light blur — clipped to its own container so it doesn't break sticky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* 1. Light Header Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-12 sm:pt-36 sm:pb-16 space-y-8">

        {/* Clean Editorial Title */}
        <div className="max-w-4xl space-y-4">
          <h1 className="font-heading text-4xl sm:text-6xl font-semibold text-slate-900 tracking-tight leading-none uppercase">
            Applied R&D <br />
            <span className="text-primary font-light italic">Environments</span>
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-body">
            MIMOS Academy is situated inside the national MIMOS Berhad headquarters, featuring direct shared access to Malaysia&apos;s leading applied research laboratories and testing environments.
          </p>
        </div>
      </div>

      {/* 2. Visual/Section transition banner */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="h-[1px] bg-slate-200 w-full mb-10" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-xs font-mono tracking-widest text-primary uppercase mb-2">Technical Capabilities</h2>
            <p className="text-xl sm:text-2xl text-slate-850 font-medium tracking-tight leading-snug">
              Step inside our certified wafer fab cleanrooms, threat ranges, and compute cores.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 tracking-widest uppercase animate-pulse">
            [ Scroll to Explore ]
          </div>
        </div>
      </div>

      {/* 3. Immersive Dark Scroll Showcase */}
      <section className="bg-slate-950 text-white border-t border-slate-900 transition-colors duration-500 mt-8 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
            
            {/* STICKY COLUMN (Left) - Hidden on Mobile, Sticky on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:flex-col lg:justify-center z-10 py-12">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl">
                {facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      activeIndex === idx
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Editorial dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  </div>
                ))}
              </div>

              {/* Minimal Scroll Progress Indicator */}
              <div className="mt-8 flex items-center gap-6 text-xs font-mono text-slate-500">
                <span className="text-slate-400 font-semibold">{`0${activeIndex + 1}`}</span>
                <div className="relative h-[2px] flex-1 bg-slate-800">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-primary"
                    animate={{ width: `${((activeIndex + 1) / facilities.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span>{`0${facilities.length}`}</span>
              </div>
            </div>

            {/* SCROLLABLE COLUMN (Right) */}
            <div className="w-full lg:w-1/2 lg:py-12">
              {facilities.map((fac, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  className="min-h-[70vh] lg:min-h-screen flex flex-col justify-center py-16 lg:py-0 border-b border-slate-900/60 last:border-0 scroll-mt-20"
                >
                  {/* Inline Image for Mobile Devices */}
                  <div className="block lg:hidden w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-850 mb-8 relative">
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Section content animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="font-mono text-xs tracking-widest text-primary font-semibold uppercase">
                        {`// ${fac.index} // ${fac.subtitle}`}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white uppercase">
                        {fac.title}
                      </h3>
                    </div>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-body">
                      {fac.desc}
                    </p>

                    {/* Specification list - minimalist border design without icons */}
                    <div className="border-t border-slate-850 pt-2 max-w-xl">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                        Specifications
                      </span>
                      <div className="divide-y divide-slate-850">
                        {fac.specs.map((spec, sIdx) => {
                          const [label, content] = spec.split(": ");
                          return (
                            <div
                              key={sIdx}
                              className="py-3 flex gap-4 text-xs sm:text-sm items-baseline hover:bg-slate-900/30 transition-colors duration-300 px-2 rounded-md"
                            >
                              <span className="font-mono text-slate-500 text-[10px] sm:text-xs shrink-0 select-none">
                                {`0${sIdx + 1}`}
                              </span>
                              <div className="flex flex-col sm:flex-row sm:gap-2">
                                <span className="text-slate-200 font-semibold">{label}</span>
                                {content && (
                                  <>
                                    <span className="hidden sm:inline text-slate-600">—</span>
                                    <span className="text-slate-400 font-body">{content}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Sleek Outro Section */}
      <div className="bg-slate-950 border-t border-slate-900 text-center py-20 lg:py-32 relative z-10">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 space-y-6">
          <h2 className="text-xs font-mono tracking-widest text-primary uppercase">MIMOS Academy</h2>
          <p className="text-xl sm:text-2xl font-medium tracking-tight text-slate-200">
            Gain direct learning access to production-grade semiconductor lines, networks, and computing infrastructures.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-xs font-mono tracking-widest text-white uppercase hover:bg-primary-hover transition-colors duration-300 shadow-lg shadow-primary/20"
            >
              Request Campus Tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
