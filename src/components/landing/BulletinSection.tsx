import { Calendar, Bell, Users, Image as ImageIcon } from "lucide-react";

export default function BulletinSection() {
  const announcements = [
    {
      id: 1,
      title: "MIMOS semiconductor lab upgrades completed",
      date: "June 20, 2026",
      desc: "Our Wafer Fab lab has been upgraded with state-of-the-art lithography chambers to support advanced deep-tech microelectronics internship tracks starting next batch."
    },
    {
      id: 2,
      title: "Corporate HRD Corp Claimable status active",
      date: "May 15, 2026",
      desc: "All upskilling programs under MIMOS Academy are officially claiming-enabled. Corporate groups can claim training costs directly through HRD Corp."
    }
  ];

  const calendarSchedules = [
    { id: 1, course: "Advanced Wafer Fabrication & Lithography", date: "15th - 19th July 2026", location: "STC Cleanroom Lab", status: "Open for Registrations" },
    { id: 2, course: "Generative AI LLM Enterprise Deployment", date: "10th - 14th Aug 2026", location: "5G & AI Innovation Hub", status: "Closing Soon" },
    { id: 3, course: "IC Design & Layout Verification", date: "24th - 28th Aug 2026", location: "IC Design Lab", status: "Open for Registrations" },
    { id: 4, course: "Certified Cybersecurity Pen-Testing", date: "07th - 11th Sept 2026", location: "Cyber-Range Lab", status: "Open for Registrations" }
  ];

  const placeholderCohorts = [
    { title: "AI Cohort Batch 1", count: "34 Students", date: "April 2026" },
    { title: "Semiconductor Lab Practical", count: "18 Engineers", date: "May 2026" },
    { title: "Enterprise Cybersecurity Drill", count: "25 IT Professionals", date: "June 2026" }
  ];

  return (
    <section className="border-t border-border bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            MIMOS Academy Bulletin
          </h2>
          <p className="mx-auto max-w-2xl text-md text-slate-500">
            Stay informed with our latest cohort schedules, training notices, and upskilling milestones.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Column 1: Announcements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm tracking-wider uppercase">
                <Bell className="h-4 w-4" />
                <span>Notice Board</span>
              </div>
              <div className="mt-6 space-y-6">
                {announcements.map((item) => (
                  <div key={item.id} className="group border-l-2 border-slate-100 pl-4 hover:border-slate-400 transition-all">
                    <span className="text-xs text-slate-400 font-semibold">{item.date}</span>
                    <h4 className="font-heading text-sm font-bold text-foreground mt-1 group-hover:text-slate-900 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-4 text-center">
              <span className="text-xs text-slate-400 font-medium">Updates are posted regularly by the Administration.</span>
            </div>
          </div>

          {/* Column 2: Upcoming Calendar Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm tracking-wider uppercase">
              <Calendar className="h-4 w-4" />
              <span>Training Calendar (2026 batches)</span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Course Title</th>
                    <th className="pb-3 font-semibold">Batch Schedule</th>
                    <th className="pb-3 font-semibold">Training Venue</th>
                    <th className="pb-3 font-semibold text-right">Enrollment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {calendarSchedules.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 font-bold text-foreground pr-2">{row.course}</td>
                      <td className="py-3.5">{row.date}</td>
                      <td className="py-3.5">{row.location}</td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          row.status === "Closing Soon" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Cohort Image Gallery Placeholders */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm tracking-wider uppercase mb-6">
            <Users className="h-4 w-4" />
            <span>MIMOS Academy Alumni & Cohorts</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {placeholderCohorts.map((cohort, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-350 transition-all duration-300">
                {/* Visual placeholder box - no image generation */}
                <div className="placeholder-image flex h-40 items-center justify-center text-slate-400 group-hover:bg-slate-100/50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">MIMOS Lab Archive</span>
                  </div>
                </div>
                {/* Label Overlay */}
                <div className="border-t border-slate-100 p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading text-xs font-bold text-foreground">{cohort.title}</h4>
                    <span className="text-[9px] font-semibold text-slate-500">{cohort.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cohort.count} certified</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
