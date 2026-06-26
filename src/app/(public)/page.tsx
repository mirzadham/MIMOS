export const dynamic = "force-dynamic";

import Link from "next/link";
import LatticeNetwork from "@/components/landing/LatticeNetwork";
import Catalog from "@/components/landing/Catalog";
import BulletinSection from "@/components/landing/BulletinSection";
import { getSafeCategories, getSafePrograms } from "@/lib/db";
import { ShieldAlert, Cpu, ArrowUpRight, GraduationCap } from "lucide-react";

export default async function Home() {
  const [categories, programs] = await Promise.all([
    getSafeCategories(),
    getSafePrograms()
  ]);

  const facilities = [
    {
      title: "Semiconductor Technology Centre (STC)",
      desc: "Equipped with class 10, 100, and 1000 cleanrooms and advanced machines for wafer fab fabrication, prototyping, and ic validation testing.",
      href: "/facilities"
    },
    {
      title: "5G & AI Innovation Hub",
      desc: "Equipped with enterprise GPU nodes and private 5G network channels to simulate, train, and test advanced ML models in secure sandboxes.",
      href: "/facilities"
    }
  ];

  return (
    <div className="relative">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 py-24 sm:py-32 bg-slate-50">
        <LatticeNetwork />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-mint-light border border-mint/25 px-3.5 py-1 text-xs font-bold text-teal">
            <Cpu className="h-3.5 w-3.5" />
            <span>National Applied R&D Talent Center</span>
          </div>

          <h1 className="mx-auto max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            Elevating Malaysia's Tech Capabilities via <span className="text-primary">Applied Upskilling</span>
          </h1>

          <p className="mx-auto max-w-2xl text-md sm:text-lg text-slate-500 leading-relaxed font-body">
            MIMOS Academy provides structured, physical classroom and lab-based industrial upskilling courses in Semiconductors, IC Design, AI, 5G, and Project Management.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="#programs-catalog"
              className="rounded-full bg-gradient-to-r from-primary to-teal hover:from-primary-hover hover:to-teal-hover text-white px-6 py-3.5 text-sm font-bold transition-all hover:shadow-md cursor-pointer"
            >
              Explore Training Catalog
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Request Corporate Training
            </Link>
          </div>
        </div>

        {/* Diagonal Gradient Border Detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {/* Dynamic Catalog Section */}
      <Catalog categories={categories} programs={programs} />

      {/* Shared Facilities Preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
          <div>
            <span className="text-xs font-bold text-teal tracking-wider uppercase">Shared Labs</span>
            <h3 className="font-heading text-2xl font-extrabold text-slate-900 mt-2 leading-tight">
              World-Class National R&D Facilities
            </h3>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed font-body">
              MIMOS Academy training modules are conducted physically inside Malaysia's top applied research labs. Students get direct access to modern wafer fabrication machinery, testing tools, and high-performance computing clusters.
            </p>
            <Link
              href="/facilities"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-teal mt-6 group hover:underline"
            >
              <span>Explore lab specifications</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facilities.map((fac, idx) => (
              <div key={idx} className="group relative rounded-xl border border-slate-200 p-6 bg-white hover:border-teal/20 transition-all duration-300">
                {/* Visual placeholder box - no image generation */}
                <div className="placeholder-image h-28 rounded-lg mb-4 flex items-center justify-center text-slate-400 group-hover:bg-mint-light/40 transition-colors">
                  <Cpu className="h-8 w-8 text-slate-300 group-hover:text-teal/50 transition-colors" />
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {fac.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy News & Bulletins */}
      <BulletinSection />

      {/* B2B Partnership Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span>Enterprise Cohorts</span>
            </div>
            <h3 className="font-heading text-2xl font-extrabold sm:text-3xl text-white">
              Upskill Your Corporate Workforce
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-body">
              Partner with MIMOS Academy to deliver specialized physical cohorts tailored for your company's engineers, technicians, and managers. Available with HRD Corp claim support.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-primary to-teal hover:from-primary-hover hover:to-teal-hover text-white px-6 py-3.5 text-sm font-bold transition-all inline-block hover:shadow-lg cursor-pointer"
            >
              Partner With Us
            </Link>
          </div>

          {/* Glowing Background Blob */}
          <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-primary opacity-25 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
