"use client";

import React, { useCallback, useRef } from "react";

interface JobFiltersProps {
  /** Category tabs including the leading "View all" pseudo-tab. */
  categories: readonly string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

/**
 * Category filter rendered as an ARIA tabs widget.
 *
 * Keyboard support follows the WAI-ARIA tabs pattern:
 * - Tab enters the tablist at the active tab (roving tabindex)
 * - ArrowLeft / ArrowRight move between tabs (wrapping)
 * - Home / End jump to the first / last tab
 */
export default function JobFilters({
  categories,
  activeCategory,
  onSelectCategory,
}: JobFiltersProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = useCallback(
    (category: string) => {
      onSelectCategory(category);
      tabRefs.current[category]?.focus();
    },
    [onSelectCategory]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, category: string) => {
    const currentIndex = categories.indexOf(category);
    if (currentIndex === -1) return;
    let nextIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % categories.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + categories.length) % categories.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = categories.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const next = categories[nextIndex];
    onSelectCategory(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-4"
      role="tablist"
      aria-label="Filter job listings by category"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            ref={(el) => {
              tabRefs.current[category] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="job-listings-container"
            tabIndex={isActive ? 0 : -1}
            onClick={() => selectTab(category)}
            onKeyDown={(e) => handleKeyDown(e, category)}
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
