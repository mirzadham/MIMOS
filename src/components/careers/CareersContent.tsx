"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobFilters from "./JobFilters";
import JobRow from "./JobRow";
import { SAMPLE_JOBS, CAREER_CATEGORIES, JobListing } from "@/data/careersData";

interface CareersContentProps {
  initialJobs?: JobListing[];
  /** Category names managed in the admin panel (without the "View all" pseudo-tab). */
  categories?: readonly string[];
}

export default function CareersContent({
  initialJobs = SAMPLE_JOBS,
  categories,
}: CareersContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("View all");

  // Tabs = "View all" + managed categories; falls back to the static default
  // categories when none are provided (e.g. server data unavailable).
  const tabs = useMemo(() => {
    const base =
      categories && categories.length > 0
        ? categories
        : CAREER_CATEGORIES.filter((c) => c !== "View all");
    return ["View all", ...base];
  }, [categories]);

  const filteredJobs = useMemo(() => {
    // If the active category no longer exists (e.g. renamed in admin), show all jobs.
    if (activeCategory === "View all" || !tabs.includes(activeCategory)) {
      return initialJobs;
    }
    return initialJobs.filter((job) => job.category === activeCategory);
  }, [activeCategory, initialJobs, tabs]);

  return (
    <section className="mx-auto max-w-5xl px-6 sm:px-8 pb-24">
      {/* Category Filters */}
      <div className="mb-8">
        <JobFilters
          categories={tabs}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* Job Listings List Container */}
      <div
        id="job-listings-container"
        role="region"
        aria-live="polite"
        aria-label="Job openings list"
        className="min-h-[300px]"
      >
        <AnimatePresence mode="wait">
          {filteredJobs.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredJobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center border-t border-slate-200"
            >
              <p className="text-slate-500 text-base font-sans">
                No active openings found in <span className="font-semibold text-slate-700">{activeCategory}</span> at this moment.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("View all")}
                className="mt-4 inline-flex items-center text-sm font-semibold text-slate-900 hover:text-primary underline cursor-pointer"
              >
                View all positions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
