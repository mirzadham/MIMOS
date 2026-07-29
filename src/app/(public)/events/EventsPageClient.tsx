"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UpcomingEvent } from "@/lib/db";
import { ChevronDown, ChevronUp, RotateCcw, ArrowUpRight, Calendar, MapPin } from "lucide-react";

interface EventsPageClientProps {
  events: UpcomingEvent[];
}

type CategoryOption = "ALL" | "LAB VISIT" | "TRAINING" | "SEMINAR" | "WORKSHOP";
type StatusTab = "UPCOMING" | "PAST";

const CATEGORY_OPTIONS: { label: string; value: CategoryOption }[] = [
  { label: "All", value: "ALL" },
  { label: "Lab Visit", value: "LAB VISIT" },
  { label: "Training", value: "TRAINING" },
  { label: "Seminar", value: "SEMINAR" },
  { label: "Workshop", value: "WORKSHOP" },
];

export default function EventsPageClient({ events }: EventsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>("ALL");
  const [statusTab, setStatusTab] = useState<StatusTab>("UPCOMING");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter events based on selected tab and category
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Status filter
      const isPast = evt.isPast ?? false;
      if (statusTab === "UPCOMING" && isPast) return false;
      if (statusTab === "PAST" && !isPast) return false;

      // Category filter
      if (selectedCategory !== "ALL" && evt.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [events, statusTab, selectedCategory]);

  // Count active filters (0 if default ALL & UPCOMING)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "ALL") count++;
    if (statusTab === "PAST") count++;
    return count;
  }, [selectedCategory, statusTab]);

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setStatusTab("UPCOMING");
    setIsCategoryOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="bg-background min-h-screen pt-28 pb-20 sm:pt-36 sm:pb-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-20 space-y-12">
        
        {/* Simple Clean Centered Hero Section */}
        <div className="space-y-4 flex flex-col items-center text-center">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 tracking-tight leading-none">
            Events
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-slate-600 font-body">
            Explore national microelectronics seminars, cleanroom lab visits, specialized workshops, and talent upskilling trainings.
          </p>
        </div>

        {/* Filter Bar (Matched to screenshot mockup) */}
        <div className="bg-slate-100/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          
          {/* Left Controls: Category Dropdown + Upcoming/Past Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Category Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`px-4 py-2.5 rounded-xl bg-white border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  selectedCategory !== "ALL"
                    ? "border-primary text-primary font-semibold"
                    : "border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span>
                  {selectedCategory === "ALL"
                    ? "Category"
                    : CATEGORY_OPTIONS.find((c) => c.value === selectedCategory)?.label}
                </span>
                {isCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white p-3 shadow-xl border border-slate-200 z-40 space-y-1"
                  >
                    {CATEGORY_OPTIONS.map((opt) => {
                      const isSelected = selectedCategory === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(opt.value);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                            isSelected
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-slate-700 hover:bg-slate-100/80"
                          }`}
                        >
                          <span>{opt.label}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upcoming / Past Toggle Buttons with Sliding Pill Animation */}
            <div className="relative flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setStatusTab("UPCOMING")}
                className={`relative px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  statusTab === "UPCOMING" ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {statusTab === "UPCOMING" && (
                  <motion.div
                    layoutId="statusTabPill"
                    className="absolute inset-0 bg-emerald-600 rounded-lg shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Upcoming</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab("PAST")}
                className={`relative px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  statusTab === "PAST" ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {statusTab === "PAST" && (
                  <motion.div
                    layoutId="statusTabPill"
                    className="absolute inset-0 bg-slate-600 rounded-lg shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Past</span>
              </button>
            </div>

          </div>

          {/* Right Controls: Active Counter + Reset Filters Button */}
          <div className="flex items-center gap-2">
            
            {/* Active Counter Pill (Primary MIMOS Orchid Magenta with White Number) */}
            <div className="w-9 h-9 rounded-xl bg-primary border border-primary/40 flex items-center justify-center font-semibold text-xs text-white shadow-xs">
              {activeFilterCount}
            </div>

            {/* Reset Filters Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Reset filters</span>
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            </button>

          </div>

        </div>

        {/* 2-Column Desktop Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border-2 border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-800">No events match your selected filters</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try switching between Upcoming/Past or clearing the category filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group relative flex flex-col sm:flex-row items-start p-6 sm:p-7 bg-white rounded-[28px] border border-slate-200 shadow-xs hover:shadow-xl hover:border-primary/50 transition-all duration-300 gap-6 cursor-pointer overflow-hidden"
              >
                {/* Left Side: Poster Cover Image (No Text Overlay) */}
                <div className="w-full sm:w-[150px] lg:w-[170px] aspect-[3/4] rounded-2xl overflow-hidden relative shrink-0 shadow-md bg-slate-900">
                  <Image
                    src={event.imageUrl || "/semiconductor_cleanroom.png"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                    sizes="(max-w-768px) 100vw, 170px"
                  />
                </div>

                {/* Right Side: Event Details & Key-Value Metadata */}
                <div className="flex-1 space-y-3.5 min-w-0 w-full">
                  {/* Title */}
                  <h2 className="font-heading text-xl lg:text-2xl font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </h2>

                  {/* Key-Value Details List */}
                  <div className="space-y-2 text-xs sm:text-sm font-sans pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-medium w-20 shrink-0">Date</span>
                      <span className="text-slate-900 font-medium capitalize">
                        {event.date.toLowerCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-medium w-20 shrink-0">Category</span>
                      <span className="text-slate-900 font-medium capitalize">
                        {event.category.toLowerCase()}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-medium w-20 shrink-0">Location</span>
                        <span className="text-slate-800 font-medium truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description Paragraph */}
                  {event.description && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-body pt-2 border-t border-slate-100">
                      {event.description}
                    </p>
                  )}

                  {/* Arrow Action Indicator */}
                  <div className="pt-2 flex items-center justify-end text-xs font-semibold text-primary">
                    <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                      <span>View Details</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
