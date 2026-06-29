import { ShieldCheck, Award, HeartHandshake, History, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Upskilled Engineers", value: "5,000+" },
    { label: "Partner Companies", value: "120+" },
    { label: "R&D Training Labs", value: "6" },
    { label: "Years of Tech R&D", value: "20+" }
  ];

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-20">
        
        {/* Breadcrumbs & Header Banner */}
        <div className="space-y-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900">About Us</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/30 p-8 sm:p-14 relative overflow-hidden shadow-neon-light hover:border-primary/10 transition-all duration-300">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full">
                Our History & Mission
              </span>
              <h1 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight">
                Upskilling Malaysia&apos;s Engineering Workforce
              </h1>
              <p className="text-sm sm:text-md text-slate-500 leading-relaxed font-body">
                MIMOS Academy was established to bridge the gap between academic theory and practical applied research. As a subsidiary of MIMOS Berhad, we coordinate and conduct hands-on technology upskilling.
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Stats Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-neon-light">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center divide-x divide-slate-100">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5 px-4 first:pl-0 last:pr-0">
                <span className="text-3xl sm:text-4xl font-black text-primary block tracking-tight">{stat.value}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="space-y-10">
          <div className="border-b border-slate-250 pb-6">
            <h2 className="font-heading text-2xl font-extrabold text-slate-900">
              Our Core Pillars
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-primary/20 hover:shadow-neon-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-primary inline-block">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">National Accreditation</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  Our certificates and course standards are verified directly under MIMOS R&D structures and supported by national HRD Corp policies.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-primary/20 hover:shadow-neon-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-primary inline-block">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">Applied Deep Tech</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  We skip generic theoretical slides. Our students work physically inside actual wafer fab cleanrooms and deep-learning clusters.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-primary/20 hover:shadow-neon-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-primary inline-block">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">B2B Co-Design</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  We collaborate with enterprise partners to build tailored physical training modules targeting active technological gaps.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-primary/20 hover:shadow-neon-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-primary inline-block">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">R&D Legacy</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  Backed by MIMOS&apos;s 20+ year legacy in microelectronics patenting, material analyses, and national data registries.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
