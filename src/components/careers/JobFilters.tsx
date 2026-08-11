"use client";

import React from "react";
import { CAREER_CATEGORIES, CategoryFilter } from "@/data/careersData";

interface JobFiltersProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

export default function JobFilters({
  activeCategory,
  onSelectCategory,
}: JobFiltersProps) {
  return (
    <div 
      className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-4"
      role="tablist"
      aria-label="Filter job listings by category"
    >
      {CAREER_CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="job-listings-container"
            onClick={() => onSelectCategory(category)}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 cursor-pointer select-none border ${
              isActive
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
