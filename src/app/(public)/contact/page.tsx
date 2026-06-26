"use client";

import { MapPin, Phone, Printer, Mail, Send, Landmark } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-teal tracking-wider uppercase">Contact Channels</span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Reach Out to Our Administration
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 leading-relaxed font-body">
            Get in touch with MIMOS Academy coordinate officers regarding enrollment questions, training schedules, or B2B custom physical training layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* Column 1 & 2: Contact Details & Location map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Info panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="space-y-4 font-body">
                <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">MIMOS Headquarters</h3>
                <div className="flex gap-2.5 items-start text-xs text-slate-500">
                  <MapPin className="h-5 w-5 text-teal shrink-0" />
                  <span>
                    MIMOS Berhad, Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur, Wilayah Persekutuan, Malaysia.
                  </span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-slate-500 border-t border-slate-100 pt-4">
                  <Phone className="h-4 w-4 text-teal" />
                  <span>Tel: +603-8995 5000</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-slate-500">
                  <Printer className="h-4 w-4 text-teal" />
                  <span>Fax: +603-8996 2755</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-slate-500">
                  <Mail className="h-4 w-4 text-teal" />
                  <a href="mailto:info@mimos.my" className="hover:text-primary hover:underline">
                    info@mimos.my
                  </a>
                </div>
              </div>

              {/* B2B Coordination notes */}
              <div className="rounded-xl bg-slate-50 p-6 border border-slate-100 space-y-4 font-body">
                <div className="flex items-center gap-2 text-slate-950 font-bold text-xs uppercase tracking-wider">
                  <Landmark className="h-4.5 w-4.5 text-teal" />
                  <span>Corporate Cohorts</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Companies interested in organizing dedicated physical training runs for their teams can contact our academic planning division directly at <a href="mailto:info@mimos.my" className="text-primary hover:underline font-bold">info@mimos.my</a> to coordinate schedules, customized course modules, and HRD Corp claim arrangements.
                </p>
              </div>
            </div>

            {/* Simulated Map Visual Placeholder */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-3">MIMOS Bukit Jalil HQ Location Map</span>
              <div className="placeholder-image h-60 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <MapPin className="h-10 w-10 text-slate-300" />
                <span className="text-xs text-slate-400 font-bold mt-2"> Bukit Jalil R&D Headquarters </span>
                <a 
                  href="https://www.google.com.my/maps/place/MIMOS+Berhad/@3.0459671,101.6937111,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-bold mt-2 block"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">Inquiry Console</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal font-body">
                Send an academic coordination query directly to our team.
              </p>
            </div>

            <form className="space-y-4 text-xs font-body" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ahmad Kamal"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. kamal@company.my"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Organization / Company</label>
                <input 
                  type="text" 
                  placeholder="e.g. Micro Tech Sdn Bhd"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase block">Your Message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your corporate training needs or general questions here..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-teal hover:from-primary-hover hover:to-teal-hover text-white py-3.5 text-xs font-bold transition-all cursor-pointer"
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
