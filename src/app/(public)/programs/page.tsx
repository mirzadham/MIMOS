import { Metadata } from "next";
import Link from "next/link";
import Catalog from "@/components/landing/Catalog";
import { getSafeCategories, getSafePrograms } from "@/lib/db";
import { ChevronRight, GraduationCap } from "lucide-react";

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
    <div className="bg-white min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient design */}
      <div className="absolute right-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs & Header Banner */}
        <div className="space-y-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900">Programmes</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/30 p-8 sm:p-14 relative overflow-hidden shadow-neon-light hover:border-primary/10 transition-all duration-300">
            {/* Soft decorative background glow */}
            <div className="absolute right-0 top-0 -mt-8 -mr-8 opacity-[0.04] text-primary pointer-events-none">
              <GraduationCap className="h-72 w-72" />
            </div>
            
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full">
                Applied R&D Curriculum
              </span>
              <h1 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight">
                Applied Engineering Programmes
              </h1>
              <p className="text-sm sm:text-md text-slate-500 leading-relaxed font-body">
                Bridge the gap between theoretical knowledge and real-world applied technology. Filter by category or search our complete syllabus list to find matching courses.
              </p>
            </div>
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
