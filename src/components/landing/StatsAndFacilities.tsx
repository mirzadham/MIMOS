"use client";

import React from "react";
import { Users, Award, BookOpen, Presentation, Laptop, Cpu, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StatItem {
  number: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface FacilityItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

export default function StatsAndFacilities() {
  const stats: StatItem[] = [
    {
      number: "150,000+",
      label: "Students & Professionals",
      desc: "Trusted by engineers and learners around Malaysia for advanced technical development.",
      icon: <Users className="h-5 w-5 text-primary" />
    },
    {
      number: "20+",
      label: "Experienced Trainers",
      desc: "Upskill directly with R&D specialists, doctoral engineers, and research scientists.",
      icon: <Award className="h-5 w-5 text-primary" />
    },
    {
      number: "10+",
      label: "Core Programmes",
      desc: "Curated curriculums spanning Semiconductors, AI, 5G, and Professional Management.",
      icon: <BookOpen className="h-5 w-5 text-primary" />
    }
  ];

  const facilities: FacilityItem[] = [
    {
      title: "Seminar Room",
      desc: "Premium executive seminar auditorium equipped with interactive smart displays, dual projector screens, and high-fidelity acoustics for tech briefings and keynotes.",
      href: "/facilities",
      icon: <Presentation className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
    },
    {
      title: "Training Room",
      desc: "Hands-on engineering computer lab furnished with localized power backup systems, dual-monitors, and software suites pre-loaded for VLSI and EDA layout designs.",
      href: "/facilities",
      icon: <Laptop className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
    },
    {
      title: "Semiconductor Technology Centre (STC)",
      desc: "Direct access to state-of-the-art cleanrooms (Class 10 to 1000) for physical wafer fabrication processes, deposition, and verification operations.",
      href: "/facilities",
      icon: <Cpu className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
    }
  ];

  return (
    <section className="border-b border-slate-100 bg-slate-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Statistics Subsection */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
                  {stat.number}
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-foreground">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities Preview Subsection */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center pt-8 border-t border-slate-200/60">
          
          {/* Left Column Description */}
          <div className="lg:col-span-4 space-y-5">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Our Infrastructure
            </span>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              World-Class Learning Facilities
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-body">
              MIMOS Academy classes are conducted physically inside Malaysia's top applied research labs and modern classrooms, allowing students direct exposure to industrial systems.
            </p>
            <div className="pt-2">
              <Link
                href="/facilities"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group hover:text-primary-hover hover:underline"
              >
                <span>View lab specs & booking schedules</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {facilities.map((facility, idx) => (
              <div 
                key={idx}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual icon box */}
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                    {facility.icon}
                  </div>
                  
                  <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {facility.title}
                  </h4>
                  
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {facility.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100/60">
                  <Link
                    href={facility.href}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
