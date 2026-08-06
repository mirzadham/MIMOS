"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogoutAction } from "@/app/actions/adminActions";
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  Handshake,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manage Programs", href: "/admin/programs", icon: BookOpen },
  { name: "Manage Events", href: "/admin/events", icon: Calendar },
  { name: "Manage Stats", href: "/admin/stats", icon: BarChart3 },
  { name: "Manage Partners", href: "/admin/partners", icon: Handshake },
  { name: "Why Choose Us", href: "/admin/why-choose-us", icon: Sparkles },
  { name: "Manage About Us", href: "/admin/about", icon: Users },
  { name: "Manage Facilities", href: "/admin/facilities", icon: Building2 },
  { name: "Manage Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Manage News", href: "/admin/news", icon: Newspaper },
];

interface AdminSidebarProps {
  adminEmail: string;
  /** Desktop rail-collapsed state (icons only). */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Mobile off-canvas drawer state. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  adminEmail,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-slate-200 bg-white",
        // Mobile: off-canvas drawer. Desktop: sticky full-height rail.
        "fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:z-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed && "lg:w-[76px]"
      )}
    >
      {/* Brand header */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-5">
        <Link
          href="/admin"
          title="MIMOS Academy Admin"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Image
            src="/MIMOS-Academy-dark.png"
            alt="MIMOS Academy"
            width={90}
            height={32}
            priority
            className={cn("h-8 w-auto object-contain", collapsed && "lg:hidden")}
          />
          {collapsed && (
            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary lg:flex">
              <ShieldCheck className="h-4 w-4" />
            </span>
          )}
          <span className={cn("rounded border border-primary/10 bg-accent px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-primary", collapsed && "lg:hidden")}>
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:block"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          {/* Mobile drawer close */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Session banner */}
      <div
        className={cn(
          "mx-4 my-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3",
          collapsed && "lg:mx-3 lg:justify-center lg:border-0 lg:bg-transparent lg:p-0"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <ShieldCheck className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <span className="block text-[10px] font-semibold uppercase leading-none text-slate-400">
              Logged In
            </span>
            <span className="mt-0.5 block truncate text-xs font-semibold text-slate-700">{adminEmail}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? link.name : undefined}
                  className={cn(
                    "group flex items-center rounded-lg text-xs font-semibold transition-colors",
                    !collapsed && "justify-between px-3 py-2.5",
                    collapsed && "lg:justify-center lg:px-2 lg:py-2.5",
                    active
                      ? "relative bg-accent text-primary before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-primary" : "text-slate-400 group-hover:text-primary"
                      )}
                    />
                    <span className={cn("truncate", collapsed && "lg:hidden")}>{link.name}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-opacity",
                      collapsed && "lg:hidden",
                      active ? "text-primary opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-slate-100 p-4">
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-red-900 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-950"
            )}
          >
            <LogOut className="h-4 w-4" />
            <span className={cn(collapsed && "lg:hidden")}>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
