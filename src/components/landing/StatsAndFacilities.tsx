"use client";

import React from "react";
import { Presentation, Laptop, Cpu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FacilityItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

export default function StatsAndFacilities() {
  const facilities: FacilityItem[] = [
    {
      title: "Seminar Room",
      desc: "Premium executive seminar auditorium equipped with interactive smart displays, dual projector screens, and high-fidelity acoustics for tech briefings and keynotes.",
      href: "/facilities",
      icon: <Presentation className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
    },
    {
      title: "Training Room",
      desc: "Hands-on engineering computer lab furnished with localized power backup systems, dual-monitors, and software suites pre-loaded for VLSI and EDA layout designs.",
      href: "/facilities",
      icon: <Laptop className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
    },
    {
      title: "Semiconductor Technology Centre (STC)",
      desc: "Direct access to state-of-the-art cleanrooms (Class 10 to 1000) for physical wafer fabrication processes, deposition, and verification operations.",
      href: "/facilities",
      icon: <Cpu className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="border-b border-slate-200/60 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Facilities Preview */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column Description */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-none border border-primary/10">
              Our Infrastructure
            </span>
            <h3 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              World-Class R&D Facilities
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-body">
              MIMOS Academy courses are conducted physically inside Malaysia&apos;s leading applied research labs and modern classrooms, allowing students direct hands-on exposure to advanced industrial systems.
            </p>
            <div className="pt-3">
              <Link
                href="/facilities"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary group hover:underline"
              >
                <span>View lab specs & booking schedules</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {facilities.map((facility, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group relative rounded-none border border-slate-200 bg-white p-6 hover:border-primary transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual icon box */}
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-none bg-slate-50 border border-slate-200/60 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                    {facility.icon}
                  </div>
                  
                  <h4 className="font-heading text-sm font-bold text-slate-900 transition-colors">
                    {facility.title}
                  </h4>
                  
                  <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed font-body">
                    {facility.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <Link
                    href={facility.href}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
