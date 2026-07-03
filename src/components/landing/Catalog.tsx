"use client";

import { useState, useTransition } from "react";
import ProgramCard from "./ProgramCard";
import { Search, FolderSync } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  hideHeader?: boolean;
}

export default function Catalog({ categories, programs, hideHeader = false }: CatalogProps) {
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
    <div id="programs-catalog" className="w-full">
      
      {/* Section Header */}
      {!hideHeader && (
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Upskilling & Industrial Training Catalog
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 font-body">
            Explore specialized physical classroom modules led by industry experts. Select a category below to filter programs.
          </p>
        </div>
      )}

      {/* Controls: Search + Categories */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-200/80 pb-8">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 border cursor-pointer ${
              activeCategory === "all"
                ? "bg-primary border-primary text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
            }`}
          >
            All Programmes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 border cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
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
            placeholder="Search programmes..."
            className="w-full rounded-lg border border-slate-250 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-800 placeholder-slate-400"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
        </div>

      </div>

      {/* Programs Grid */}
      <AnimatePresence mode="popLayout">
        {filteredPrograms.length > 0 ? (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          >
            {filteredPrograms.map((program) => (
              <motion.div 
                layout 
                key={program.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center border border-dashed border-slate-200 rounded-2xl p-16 bg-slate-50/50"
          >
            <FolderSync className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-heading text-base font-bold text-slate-900">No programmes found</h3>
            <p className="mt-2 text-xs text-slate-500 font-body max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any courses matching &quot;{searchQuery}&quot; under the selected category.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
