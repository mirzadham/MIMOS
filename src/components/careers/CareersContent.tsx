"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobFilters from "./JobFilters";
import JobRow from "./JobRow";
import { SAMPLE_JOBS, CategoryFilter, JobListing } from "@/data/careersData";

interface CareersContentProps {
  initialJobs?: JobListing[];
}

export default function CareersContent({
  initialJobs = SAMPLE_JOBS,
}: CareersContentProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("View all");

  const filteredJobs = useMemo(() => {
    if (activeCategory === "View all") {
      return initialJobs;
    }
    return initialJobs.filter((job) => job.category === activeCategory);
  }, [activeCategory, initialJobs]);

  return (
    <section className="mx-auto max-w-5xl px-6 sm:px-8 pb-24">
      {/* Category Filters */}
      <div className="mb-8">
        <JobFilters
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
