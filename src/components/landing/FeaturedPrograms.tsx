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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary border border-primary/10">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Handpicked Modules</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Featured Training Programs
        </h2>
        <p className="mx-auto max-w-2xl text-md text-slate-500">
          Explore our signature upskilling courses in Semiconductor, Data Science, and Project Management.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Link
          href="/programs"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/95 transition-all hover:shadow-md group"
        >
          <span>View All Programs</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </div>
  );
}
