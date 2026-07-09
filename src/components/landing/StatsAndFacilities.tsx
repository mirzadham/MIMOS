"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatsAndFacilities() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <section className="border-b border-slate-200/60 bg-slate-50/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Our Facilities
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-body">
            MIMOS Academy courses are conducted physically inside Malaysia&apos;s leading applied research labs and modern classrooms, allowing students direct hands-on exposure to advanced industrial systems.
          </p>
        </div>

        {/* Dual Split-Pane Hover Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="group flex flex-col lg:flex-row w-full h-auto lg:h-[480px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          {/* Left Pane - Lab */}
          <Link
            href="/facilities#lab"
            className="group/pane relative w-full h-[280px] lg:h-full lg:w-1/2 lg:group-hover:w-[30%] lg:group-focus-within:w-[30%] lg:hover:!w-[70%] lg:focus-within:!w-[70%] transition-all duration-500 ease-in-out overflow-hidden border-b lg:border-b-0 border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:z-10"
          >
            {/* Background Image */}
            <img
              src="/semiconductor_cleanroom.png"
              alt="Lab"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover/pane:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 lg:bg-slate-950/45 transition-colors duration-500 lg:group-hover/pane:bg-slate-950/70" />
            
            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-100 lg:opacity-0 lg:group-hover/pane:opacity-100 lg:group-focus-within/pane:opacity-100 transition-opacity duration-500">
              <h4 className="font-heading text-2xl sm:text-3xl font-semibold text-white tracking-tight drop-shadow-sm mb-3">
                Lab
              </h4>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:text-primary-hover hover:underline">
                <span>Click for details</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          {/* Right Pane - Training Room */}
          <Link
            href="/facilities#training-room"
            className="group/pane relative w-full h-[280px] lg:h-full lg:w-1/2 lg:group-hover:w-[30%] lg:group-focus-within:w-[30%] lg:hover:!w-[70%] lg:focus-within:!w-[70%] transition-all duration-500 ease-in-out overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:z-10"
          >
            {/* Background Image */}
            <img
              src="/ai_5g_hub.png"
              alt="Training Room"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover/pane:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 lg:bg-slate-950/45 transition-colors duration-500 lg:group-hover/pane:bg-slate-950/70" />
            
            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-100 lg:opacity-0 lg:group-hover/pane:opacity-100 lg:group-focus-within/pane:opacity-100 transition-opacity duration-500">
              <h4 className="font-heading text-2xl sm:text-3xl font-semibold text-white tracking-tight drop-shadow-sm mb-3">
                Training Room
              </h4>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:text-primary-hover hover:underline">
                <span>Click for details</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
