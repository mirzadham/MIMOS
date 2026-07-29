"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UpcomingEvent } from "@/lib/db";
import { ArrowUpRight, Calendar, MapPin, X, CheckCircle2 } from "lucide-react";

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative bg-background py-16 sm:py-24 border-b border-slate-200/70 overflow-hidden select-none">
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 lg:px-20">
        
        {/* Section Header */}
        <div className="pb-8">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Upcoming Events
          </h2>
        </div>

        {/* Events Table List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="divide-y-2 divide-slate-200 border-t-2 border-b-2 border-slate-200"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link
                href={`/events/${event.id}`}
                className="group relative flex flex-col md:flex-row md:items-start justify-between py-7 sm:py-9 px-3 sm:px-6 cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-sm gap-4 md:gap-8"
              >
                {/* Left & Middle Column Wrapper */}
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 lg:gap-24 flex-1">
                  
                  {/* Date Column */}
                  <div className="w-28 flex-shrink-0 text-left pt-1 sm:pt-1.5">
                    <span className="text-sm sm:text-base font-medium capitalize tracking-wider text-primary font-sans">
                      {event.date.toLowerCase()}
                    </span>
                  </div>

                  {/* Event Title */}
                  <div className="flex-1 text-left">
                    <h3 className="font-heading text-[28px] sm:text-[32px] font-semibold text-slate-900 leading-tight group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                  </div>

                </div>

                {/* Right Column: Category Tag (Top & Left Aligned) + Arrow Indicator */}
                <div className="mt-2 md:mt-0 w-full md:w-36 lg:w-44 flex-shrink-0 flex items-start justify-between md:justify-start gap-4 pt-1 sm:pt-1.5">
                  <span className="text-xs sm:text-sm font-medium capitalize tracking-widest text-primary font-sans text-left">
                    {event.category.toLowerCase()}
                  </span>

                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary shrink-0 ml-auto md:ml-0">
                    <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Modal Dialog for Event Quick View / Registration */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedEvent.date}</span>
                  <span className="text-slate-300">•</span>
                  <span>{selectedEvent.category}</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>

              {/* Details & Location */}
              <div className="mt-6 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                <p>{selectedEvent.description}</p>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>HRD Corp Claimable & Open for Registration</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>

                  <Link
                    href={selectedEvent.link || "/programs"}
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    <span>View Programme</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
