"use client";

import { useState, useTransition } from "react";
import ProgramCard from "./ProgramCard";
import { Search, FolderSync } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  duration: string | null;
  price: string | null;
  categoryId: string;
  category?: {
    name: string;
  };
}

interface CatalogProps {
  categories: Category[];
  programs: Program[];
}

export default function Catalog({ categories, programs }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleCategoryChange = (slug: string) => {
    startTransition(() => {
      setActiveCategory(slug);
    });
  };

  // Filter Logic
  const filteredPrograms = programs.filter((program) => {
    // Category match
    const categoryMatch =
      activeCategory === "all" ||
      program.categoryId === activeCategory ||
      program.category?.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      false;

    // Search query match
    const searchMatch =
      searchQuery === "" ||
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.category?.name && program.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  return (
    <div id="programs-catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Upskilling & Industrial Training Catalog
        </h2>
        <p className="mx-auto max-w-2xl text-md text-slate-500">
          Explore specialized physical classroom modules led by industry experts. Select a category below to filter programs.
        </p>
      </div>

      {/* Controls: Search + Categories */}
      <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-6">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
              activeCategory === "all"
                ? "bg-[#d7569f] border-[#d7569f] text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            All Programs
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? "bg-[#d7569f] border-[#d7569f] text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs..."
            className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs focus:border-[#d7569f] focus:outline-none focus:ring-1 focus:ring-[#d7569f]"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-16 text-center border border-dashed border-slate-200 rounded-2xl p-12 bg-slate-50">
          <FolderSync className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">No programs found</h3>
          <p className="mt-2 text-xs text-slate-500">
            We couldn't find any courses matching "{searchQuery}" under the selected category.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-6 inline-flex items-center rounded-md bg-[#d7569f] px-4 py-2 text-xs font-bold text-white hover:bg-[#c0438a] transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
