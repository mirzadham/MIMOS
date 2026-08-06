"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_STORAGE_KEY = "mimos:admin:sidebar-collapsed";
const SIDEBAR_CHANGE_EVENT = "mimos:admin:sidebar-change";

function subscribeSidebarCollapsed(callback: () => void) {
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback);
  return () => window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback);
}

function getSidebarCollapsedSnapshot(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    // storage unavailable — keep default
    return false;
  }
}

/** Server/hydration snapshot: sidebar always starts expanded, then syncs post-hydration. */
const getSidebarCollapsedServerSnapshot = () => false;

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

/**
 * Admin dashboard shell: responsive sidebar (desktop rail / mobile drawer),
 * mobile top bar, and the scrollable content column.
 */
export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot
  );

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const toggleCollapse = () => {
    const next = !collapsed;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
    } catch {
      // storage unavailable — state still updates for this session
    }
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <Image
            src="/MIMOS-Academy-dark.png"
            alt="MIMOS Academy"
            width={90}
            height={32}
            className="h-7 w-auto object-contain"
          />
          <span className="rounded border border-primary/10 bg-accent px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-primary">
            Admin
          </span>
        </Link>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="flex">
        <AdminSidebar
          adminEmail={adminEmail}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
