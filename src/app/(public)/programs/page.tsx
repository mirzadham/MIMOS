import { Metadata } from "next";
import Catalog from "@/components/landing/Catalog";
import { getSafeCategories, getSafePrograms } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Applied Engineering Programmes | MIMOS Academy",
  description: "Bridge the gap between theoretical knowledge and real-world applied technology. Filter by category or search our complete syllabus list to find matching courses.",
};

export default async function ProgramsPage() {
  const [categories, programs] = await Promise.all([
    getSafeCategories(),
    getSafePrograms()
  ]);

  return (
    <div className="bg-[#f1f5f9] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 relative overflow-hidden">
      {/* Background ambient design */}
      <div className="absolute right-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs & Header Banner */}
        <div className="space-y-6">
          
          {/* Centered Editorial Header */}
          <div className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
            <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">
              Learn from the Best
            </span>
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-semibold text-slate-900 tracking-tight leading-none uppercase">
              Academy
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-slate-650 leading-relaxed font-body font-medium">
              Bridge the gap between theoretical knowledge and real-world applied technology.
            </p>
          </div>
        </div>

        {/* Catalog List */}
        <div>
          <Catalog categories={categories} programs={programs} hideHeader={true} />
        </div>

      </div>
    </div>
  );
}
