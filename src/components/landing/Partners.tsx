"use client";

import React from "react";
import { Landmark, Briefcase, Cpu, GraduationCap, Workflow, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface Partner {
  name: string;
  category: string;
  icon: React.ReactNode;
}

export default function Partners() {
  const partners: Partner[] = [
    { name: "MSIA", category: "Semiconductors", icon: <Cpu className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "TalentCorp", category: "Government Body", icon: <Briefcase className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "CREST", category: "Collaborative R&D", icon: <Workflow className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "Dassault Systèmes", category: "Enterprise Tech", icon: <Landmark className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "Inari Amertron", category: "Semiconductors", icon: <Cpu className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "Keysight Technologies", category: "Electronic Test", icon: <Shield className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "USM", category: "Research University", icon: <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> },
    { name: "UTM", category: "Technical University", icon: <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" /> }
  ];

  return (
    <section className="border-b border-slate-200/60 bg-slate-50/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
            Collaborative Ecosystem
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            Trusted by Industry & Academia Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-body max-w-xl mx-auto">
            Working hand-in-hand with leading national agencies and global corporations to shape a ready workforce.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-8">
          {partners.map((partner, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative rounded-xl border border-slate-200/80 p-5 bg-white hover:border-primary/20 hover:shadow-neon-hover transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all shrink-0">
                {partner.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading text-xs font-bold text-slate-900 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase font-mono">
                  {partner.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
