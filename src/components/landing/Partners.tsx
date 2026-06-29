"use client";

import React from "react";
import { Landmark, Briefcase, Cpu, GraduationCap, Workflow, Shield } from "lucide-react";

interface Partner {
  name: string;
  category: string;
  icon: React.ReactNode;
}

export default function Partners() {
  const partners: Partner[] = [
    { name: "MSIA", category: "Industry Association", icon: <Cpu className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "TalentCorp", category: "Government Body", icon: <Briefcase className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "CREST", category: "Collaborative R&D", icon: <Workflow className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "Dassault Systèmes", category: "Enterprise Technology", icon: <Landmark className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "Inari Amertron", category: "Semiconductors", icon: <Cpu className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "Keysight Technologies", category: "Electronic Test & Measurement", icon: <Shield className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "USM", category: "Research University", icon: <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> },
    { name: "UTM", category: "Technical University", icon: <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> }
  ];

  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Collaborative Network
          </span>
          <h2 className="font-heading text-xl font-extrabold text-slate-800 tracking-tight">
            Our Key Partners & Collaborators
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4 mt-8">
          {partners.map((partner, idx) => (
            <div 
              key={idx}
              className="group relative rounded-xl border border-slate-200 p-5 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 flex items-center gap-3.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:bg-slate-50 group-hover:border-slate-300 transition-all shrink-0 shadow-sm">
                {partner.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading text-xs font-extrabold text-foreground group-hover:text-slate-900 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {partner.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            Working hand-in-hand with leading agencies and corporations to create a future-ready engineering workforce.
          </p>
        </div>

      </div>
    </section>
  );
}
