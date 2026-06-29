import { Calendar, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const articles = [
    {
      id: 1,
      title: "MIMOS semiconductor technology cleanroom upgrades completed",
      category: "Facilities Update",
      date: "June 20, 2026",
      desc: "Our Wafer Fab lab has been upgraded with state-of-the-art lithography chambers to support advanced deep-tech microelectronics internship tracks starting next batch. Students in upcoming runs will gain experience in 180nm process steps."
    },
    {
      id: 2,
      title: "Corporate HRD Corp Claimable status active",
      category: "Administration",
      date: "May 15, 2026",
      desc: "All upskilling programs under MIMOS Academy are officially claiming-enabled. Corporate groups can claim training costs directly through HRD Corp, simplifying corporate cohort applications."
    },
    {
      id: 3,
      title: "PMP hybrid Agile frameworks alignment completed",
      category: "Syllabus Update",
      date: "April 02, 2026",
      desc: "Our Project Management courses have been updated to reflect the latest agile methodologies in PMBOK Guide 7th Edition, focusing on hybrid development sprint coordination."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs & Header */}
        <div className="space-y-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900">News & Bulletin</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/30 p-8 sm:p-14 relative overflow-hidden shadow-neon-light hover:border-primary/10 transition-all duration-300">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full">
                Bulletin Board
              </span>
              <h1 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight">
                News, Announcements & Batch Calendars
              </h1>
              <p className="text-sm sm:text-md text-slate-500 leading-relaxed font-body">
                Stay updated with corporate notices, curriculum changes, facility updates, and batch timelines issued by MIMOS Academy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
          
          {/* Announcements list */}
          <div className="lg:col-span-2 space-y-6">
            {articles.map((art) => (
              <article 
                key={art.id} 
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-neon-light hover:shadow-neon-hover hover:border-primary/15 transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-primary bg-primary/5 px-2.5 py-0.5 rounded border border-primary/10 uppercase tracking-wide">
                    {art.category}
                  </span>
                  <span className="text-slate-405 text-slate-400 uppercase tracking-wider">{art.date}</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 hover:text-primary transition-colors leading-snug">
                  {art.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">
                  {art.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Side calendar widget */}
          <div className="space-y-6">
            
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-neon-light space-y-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs tracking-widest uppercase border-b border-slate-100 pb-4">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <span>Next 30 Days Batches</span>
              </div>

              <div className="space-y-5 text-xs font-body">
                
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block leading-tight">Advanced Wafer Fabrication & Lithography</span>
                  <span className="text-slate-400 block font-semibold">15th - 19th July 2026</span>
                  <span className="text-primary font-bold block text-[10px] uppercase tracking-wider">Status: Open</span>
                </div>

                <div className="border-t border-slate-105 border-slate-100 pt-5 space-y-1.5">
                  <span className="font-bold text-slate-900 block leading-tight">Generative AI LLM Enterprise Deployment</span>
                  <span className="text-slate-400 block font-semibold">10th - 14th Aug 2026</span>
                  <span className="text-amber-600 font-bold block text-[10px] uppercase tracking-wider">Status: Closing Soon</span>
                </div>

                <div className="border-t border-slate-105 border-slate-100 pt-5 space-y-1.5">
                  <span className="font-bold text-slate-900 block leading-tight">IC Design & Layout Verification</span>
                  <span className="text-slate-400 block font-semibold">24th - 28th Aug 2026</span>
                  <span className="text-primary font-bold block text-[10px] uppercase tracking-wider">Status: Open</span>
                </div>

              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-neon-light space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs tracking-widest uppercase">
                <Bell className="h-4 w-4 text-primary" />
                <span>Corporate Notices</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                For customized batch schedules, company cohort allocations, or custom lab access setups, please coordinate directly with our administration office.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
