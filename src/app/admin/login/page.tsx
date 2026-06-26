"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/app/actions/adminActions";
import { GraduationCap, ShieldAlert, KeyRound, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await adminLoginAction(formData);

    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-light border border-mint/20 text-teal">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 leading-none">
            MIMOS Academy
          </h2>
          <span className="font-sans text-xs font-semibold tracking-wider text-slate-400 uppercase block">
            Command Center Login
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 border border-red-150 flex items-start gap-2 text-xs font-medium text-red-600">
            <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-4 text-xs font-body" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase block">Administrator Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                defaultValue="admin@mimos.my"
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none"
                placeholder="admin@mimos.my"
              />
              <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase block">Access Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                defaultValue="mimos2026"
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-teal hover:from-primary-hover hover:to-teal-hover text-white py-3.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Verifying..." : "Access Control Center"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          
          <div className="text-center text-[10px] text-slate-400 font-semibold mt-2">
            Username: admin@mimos.my | Password: mimos2026
          </div>

        </form>

      </div>
    </div>
  );
}
