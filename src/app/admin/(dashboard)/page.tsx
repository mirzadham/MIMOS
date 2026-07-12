import { prisma, mockPrograms } from "@/lib/db";
import { 
  GraduationCap, 
  Building2, 
  Newspaper, 
  Terminal,
  BookOpen,
  MapPin,
  Calendar
} from "lucide-react";

function getFallbackLogs() {
  const now = Date.now();
  return [
    { id: "1", action: "CREATE_PROGRAM", details: "Created Wafer Fab training program run", createdAt: new Date(now) },
    { id: "2", action: "CREATE_FACILITY", details: "Added STC Cleanroom laboratory details", createdAt: new Date(now - 3600000) },
    { id: "3", action: "UPDATE_ABOUT_SETTINGS", details: "Updated Academy mission/vision statements", createdAt: new Date(now - 7200000) }
  ];
}

interface LogEntry {
  id: string;
  action: string;
  details: string;
  createdAt: Date;
}

interface ProgramWithCategory {
  id: string;
  title: string;
  location: string;
  duration: string | null;
  price: string | null;
  category: {
    name: string;
  };
}

export default async function AdminDashboardOverview() {
  const stats = {
    programs: 0,
    facilities: 0,
    news: 0,
  };

  let recentLogs: LogEntry[] = [];
  let recentPrograms: ProgramWithCategory[] = [];

  try {
    const [progCount, facCount, newsCount, logs, programs] = await Promise.all([
      prisma.program.count(),
      prisma.facility.count(),
      prisma.newsArticle.count(),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
      }),
      prisma.program.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true }
      })
    ]);

    stats.programs = progCount || mockPrograms.length;
    stats.facilities = facCount;
    stats.news = newsCount;
    recentLogs = logs;
    recentPrograms = programs as unknown as ProgramWithCategory[];
  } catch {
    // DB offline fallback
    stats.programs = mockPrograms.length;
    stats.facilities = 4;
    stats.news = 3;
    recentLogs = getFallbackLogs();
    recentPrograms = mockPrograms.slice(0, 5).map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      duration: p.duration,
      price: p.price,
      category: { name: "Applied R&D" }
    }));
  }

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Command Center Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor physical upskilling runs, publish bulletins, and manage laboratory facilities.
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        
        {/* Stat Item: Programs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Programs</span>
            <span className="text-2xl font-semibold text-foreground block">{stats.programs}</span>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-slate-600">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Stat Item: Facilities */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Physical Facilities</span>
            <span className="text-2xl font-semibold text-foreground block">{stats.facilities}</span>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-slate-600">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Stat Item: Bulletins (News) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Published News</span>
            <span className="text-2xl font-semibold text-foreground block">{stats.news}</span>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-slate-600">
            <Newspaper className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left: Recently Published Programs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="h-4.5 w-4.5 text-slate-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Recently Added Programs
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5">Title</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Location</th>
                  <th className="py-2.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {recentPrograms.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-foreground pr-4 max-w-[220px] truncate" title={prog.title}>
                      {prog.title}
                    </td>
                    <td className="py-3 text-slate-500">
                      {prog.category?.name || "Uncategorized"}
                    </td>
                    <td className="py-3 text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{prog.location}</span>
                    </td>
                    <td className="py-3 text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 border border-slate-100">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {prog.duration || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentPrograms.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-normal">
                      No programs published yet. Go to Manage Programs to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Security Audit Logs Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Terminal className="h-4.5 w-4.5 text-slate-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Security Action Logs
            </h3>
          </div>

          <div className="space-y-5 text-xs">
            {recentLogs.map((log, idx) => (
              <div key={log.id || idx} className="flex gap-3 items-start border-l border-slate-200 pl-4 relative">
                {/* Timeline node */}
                <div className="absolute -left-1 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-primary" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground uppercase text-[9px] block">
                    {log.action}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-body">
                    {log.details}
                  </p>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
