import { Calendar, Bell } from "lucide-react";

export default function NewsPage() {
  const articles = [
    {
      id: 1,
      title: "MIMOS semiconductor lab upgrades completed",
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
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">Bulletin Board</span>
          <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
            News, Announcements & Batch Calendars
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-body">
            Stay updated with corporate notices, curriculum changes, facility updates, and batch timelines issued by MIMOS Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Announcements list */}
          <div className="lg:col-span-2 space-y-8">
            {articles.map((art) => (
              <article key={art.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary uppercase tracking-wider">{art.category}</span>
                  <span className="text-slate-400 font-semibold">{art.date}</span>
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground hover:text-primary cursor-pointer transition-colors leading-snug">
                  {art.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-body">
                  {art.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Side calendar widget */}
          <div className="space-y-6">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase border-b border-slate-100 pb-3">
                <Calendar className="h-4.5 w-4.5" />
                <span>Next 30 Days Batches</span>
              </div>

              <div className="space-y-4 text-xs font-body">
                
                <div className="space-y-1">
                  <span className="font-bold text-foreground block">Advanced Wafer Fabrication & Lithography</span>
                  <span className="text-slate-400 block">15th - 19th July 2026</span>
                  <span className="text-primary font-bold block">Status: Open</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-1">
                  <span className="font-bold text-foreground block">Generative AI LLM Enterprise Deployment</span>
                  <span className="text-slate-400 block">10th - 14th Aug 2026</span>
                  <span className="text-amber-500 font-bold block">Status: Closing Soon</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-1">
                  <span className="font-bold text-foreground block">IC Design & Layout Verification</span>
                  <span className="text-slate-400 block">24th - 28th Aug 2026</span>
                  <span className="text-primary font-bold block">Status: Open</span>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                <Bell className="h-4 w-4" />
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
