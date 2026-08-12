"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { selectShowcaseFacilities, type FeaturedFacility } from "@/lib/facilities";

interface Pane {
  id: string;
  href: string;
  label: string; // Fixed slot label ("Lab" / "Training Room") — never changes
  imageUrl: string | null;
  alt: string;
}

// Fallback panes render when a slot has no featured facility (or the DB fetch
// fails): the label stays, only the photo is a placeholder. Same pair the
// migration backfills, so the homepage can never render broken.
const FALLBACK_PANES: Pane[] = [
  {
    id: "fallback-lab",
    href: "/facilities",
    label: "Lab",
    imageUrl: "/semiconductor_cleanroom.png",
    alt: "Lab",
  },
  {
    id: "fallback-training-room",
    href: "/facilities",
    label: "Training Room",
    imageUrl: "/ai_5g_hub.png",
    alt: "Training Room",
  },
];

function FacilityPane({ pane }: { pane: Pane }) {
  // Two panes: the 70/30 hover interplay expands the hovered pane.
  const paneWidthClasses =
    "lg:w-1/2 lg:group-hover:w-[30%] lg:group-focus-within:w-[30%] lg:hover:!w-[70%] lg:focus-within:!w-[70%]";

  return (
    <Link
      href={pane.href}
      className={`group/pane relative w-full h-[280px] lg:h-full ${paneWidthClasses} transition-all duration-500 ease-in-out overflow-hidden border-b lg:border-b-0 border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:z-10`}
    >
      {pane.imageUrl ? (
        <Image
          src={pane.imageUrl}
          alt={pane.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 lg:group-hover/pane:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-950" />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 lg:bg-slate-950/45 transition-colors duration-500 lg:group-hover/pane:bg-slate-950/70" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-100 lg:opacity-0 lg:group-hover/pane:opacity-100 lg:group-focus-within/pane:opacity-100 transition-opacity duration-500">
        <h4 className="font-heading text-2xl sm:text-3xl font-semibold text-white tracking-tight drop-shadow-sm mb-3">
          {pane.label}
        </h4>
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:text-primary-hover hover:underline">
          <span>Click for details</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function StatsAndFacilities({ facilities = [] }: { facilities?: FeaturedFacility[] }) {
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

  // Fixed two-slot showcase: left pane is the featured Lab, right pane is the
  // featured Training Room. Each slot falls back independently.
  const { lab, trainingRoom } = selectShowcaseFacilities(facilities);

  const panes: Pane[] = [
    lab
      ? { id: lab.id, href: "/facilities", label: "Lab", imageUrl: lab.imageUrl, alt: lab.title }
      : FALLBACK_PANES[0],
    trainingRoom
      ? {
          id: trainingRoom.id,
          href: "/facilities",
          label: "Training Room",
          imageUrl: trainingRoom.imageUrl,
          alt: trainingRoom.title,
        }
      : FALLBACK_PANES[1],
  ];

  return (
    <section className="border-b border-slate-200/60 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Our Facilities
          </h3>
        </div>

        {/* Dual Split-Pane Hover Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="group flex flex-col lg:flex-row w-full h-auto lg:h-[480px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          {panes.map((pane) => (
            <FacilityPane key={pane.id} pane={pane} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
