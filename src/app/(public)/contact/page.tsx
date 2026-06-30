"use client";

import { MapPin, Phone, Printer, Mail, Send, Landmark, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-none bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs & Header */}
        <div className="space-y-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900">Contact Us</span>
          </nav>

          {/* Editorial Banner */}
          <div className="rounded-none border border-slate-200 bg-white p-8 sm:p-14 relative overflow-hidden transition-all duration-300">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-none border border-primary/10">
                Get In Touch
              </span>
              <h1 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight">
                Reach Our Advisory Team
              </h1>
              <p className="text-sm sm:text-md text-slate-600 leading-relaxed font-body">
                Get in touch with MIMOS Academy coordinate officers regarding enrollment questions, training schedules, or B2B custom physical training layouts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
          
          {/* Column 1 & 2: Contact Details & Location map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Info panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 rounded-none border border-slate-200 bg-white p-6 sm:p-8">
              <div className="space-y-5 font-body">
                <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-widest">MIMOS Headquarters</h3>
                <div className="flex gap-3 items-start text-xs text-slate-500 leading-relaxed">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-slate-600">
                    MIMOS Berhad, Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur, Malaysia.
                  </span>
                </div>
                <div className="flex gap-3 items-center text-xs text-slate-500 border-t border-slate-100 pt-4">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-slate-700">Tel: +603-8995 5000</span>
                </div>
                <div className="flex gap-3 items-center text-xs text-slate-500">
                  <Printer className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-slate-700">Fax: +603-8996 2755</span>
                </div>
                <div className="flex gap-3 items-center text-xs text-slate-500">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href="mailto:info@mimos.my" className="hover:text-primary transition-colors font-bold text-slate-700">
                    info@mimos.my
                  </a>
                </div>
              </div>

              {/* B2B Coordination notes */}
              <div className="rounded-none bg-slate-50/50 p-6 border border-slate-200/80 space-y-4 font-body">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Landmark className="h-4.5 w-4.5 text-primary" />
                  <span>Corporate Cohorts</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Companies interested in organizing dedicated physical training runs for their teams can contact our academic planning division directly at <a href="mailto:info@mimos.my" className="text-primary hover:underline font-bold">info@mimos.my</a> to coordinate schedules, customized course modules, and HRD Corp claim arrangements.
                </p>
              </div>
            </div>

            {/* Simulated Map Visual Placeholder */}
            <div className="rounded-none border border-slate-200 bg-white p-6">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-4">MIMOS Bukit Jalil HQ Location Map</span>
              <div className="relative h-60 rounded-none overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                {/* Visual grid lines for map placeholder */}
                <div className="absolute inset-0 placeholder-image opacity-30 pointer-events-none" />
                <MapPin className="h-10 w-10 text-primary relative z-10 drop-shadow-sm animate-pulse" />
                <span className="text-sm text-slate-900 font-extrabold mt-3 relative z-10"> Bukit Jalil R&D Headquarters </span>
                <a 
                  href="https://www.google.com.my/maps/place/MIMOS+Berhad/@3.0459671,101.6937111,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-bold mt-2.5 relative z-10"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Form */}
          <div className="rounded-none border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            
            <div>
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-widest">Inquiry Console</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal font-body">
                Send an academic coordination query directly to our team.
              </p>
            </div>

            <form className="space-y-4 text-xs font-body" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase block">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ahmad Kamal"
                  className="w-full rounded-none border border-slate-250 bg-white px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. kamal@company.my"
                  className="w-full rounded-none border border-slate-250 bg-white px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase block">Organization / Company</label>
                <input 
                  type="text" 
                  placeholder="e.g. Micro Tech Sdn Bhd"
                  className="w-full rounded-none border border-slate-250 bg-white px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase block">Your Message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your corporate training needs or general questions here..."
                  className="w-full rounded-none border border-slate-250 bg-white px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-none bg-primary hover:bg-primary-hover text-white py-4 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Submit Query</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
