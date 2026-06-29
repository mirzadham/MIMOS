import Link from "next/link";
import ProgramCard from "./ProgramCard";
import { ArrowRight, Sparkles } from "lucide-react";

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

interface FeaturedProgramsProps {
  programs: Program[];
}

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  // Slugs of the 3 featured programs chosen by the user
  const featuredSlugs = [
    "semiconductor-wafer-fabrication",
    "certified-data-science-practitioner",
    "pmp-certification-training"
  ];

  // Filter to get the featured programs in the exact order of featuredSlugs
  const featuredPrograms = featuredSlugs
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter((p): p is Program => !!p);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 relative">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-10">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-bold text-primary border border-primary/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Top R&D Modules</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Featured Training Programmes
          </h2>
          <p className="text-sm sm:text-md text-slate-500 font-body leading-relaxed">
            Accelerate your engineering credentials. Explore our flagship upskilling courses in Semiconductor fabrication, advanced Artificial Intelligence, and Professional Project Management.
          </p>
        </div>
        
        <div className="shrink-0">
          <Link
            href="/programs"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-primary transition-all duration-200 shadow-sm group"
          >
            <span>Explore All Programmes</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

    </div>
  );
}
