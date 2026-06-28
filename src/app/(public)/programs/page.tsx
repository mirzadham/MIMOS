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
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs & Header Banner */}
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900">Programmes</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 opacity-[0.03] text-primary pointer-events-none">
              <GraduationCap className="h-64 w-64" />
            </div>
            
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                Academic & Industrial Upskilling
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-5xl tracking-tight leading-none">
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
