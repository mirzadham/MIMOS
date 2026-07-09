import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionAdmin } from "@/lib/adminAuth";
import { adminLogoutAction } from "@/app/actions/adminActions";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  FileSpreadsheet, 
  Award, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Handshake,
  Sparkles,
  MessageSquare,
  Users,
  Newspaper
} from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Session check: if not logged in, redirect to login
  const admin = await getSessionAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const sidebarLinks = [
    { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Programs", href: "/admin/programs", icon: BookOpen },
    { name: "Manage Stats", href: "/admin/stats", icon: BarChart3 },
    { name: "Manage Partners", href: "/admin/partners", icon: Handshake },
    { name: "Why Choose Us", href: "/admin/why-choose-us", icon: Sparkles },
    { name: "Manage About Us", href: "/admin/about", icon: Users },
    { name: "Manage Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Manage News", href: "/admin/news", icon: Newspaper },
    { name: "MS Forms Importer", href: "/admin/enrollments", icon: FileSpreadsheet },
    { name: "Certificate Vault", href: "/admin/certificates", icon: Award },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Top Brand Branding */}
          <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <div className="flex flex-col">
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground leading-none">
                MIMOS
              </span>
              <span className="font-sans text-[10px] font-semibold tracking-widest text-primary uppercase">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Quick Session user banner */}
          <div className="mx-4 my-4 p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase leading-none">Logged In</span>
              <span className="text-xs font-semibold text-slate-700 block truncate mt-0.5">{admin.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 mt-4 space-y-1 text-xs font-semibold">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Action */}
        <div className="p-4 border-t border-slate-100">
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-150 py-2.5 text-xs font-semibold text-slate-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>

    </div>
  );
}
