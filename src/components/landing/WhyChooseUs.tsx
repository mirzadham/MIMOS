"use client";

import React from "react";
import { BookOpen, Users, Award } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Interactive Learning Approach",
      desc: "Engage in hands-on, immersive learning experiences designed to enhance understanding and retention. Our interactive methods ensure students develop practical, real-world skills.",
      badges: ["C Programming", "Python", "Advanced Programming", "Algebra"]
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Experienced Instructors",
      desc: "Learn directly from MIMOS research engineers and industry experts with years of practical experience in wafer fabrication, IC design, and enterprise-grade software development.",
      badges: ["Mentorship", "Industry Labs", "R&D Specialists", "Advisory Support"]
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Certifications",
      desc: "Earn industry-recognized, accredited credentials upon course completion. Boost your technical authority and career prospects with certifications backed by Malaysia's R&D Center.",
      badges: ["HRD Corp Claimable", "National R&D Badge", "Accredited Programs"]
    }
  ];

  return (
    <section className="border-b border-slate-100 bg-slate-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Why Choose Us?
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bridging Education and Industry Excellence
          </h2>
          <p className="text-sm text-slate-500 font-body">
            MIMOS Academy integrates high-performance lab infrastructures with experienced researchers to offer upskilling tracks that stand out globally.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  {feature.icon}
                </div>
                
                <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-body">
                  {feature.desc}
                </p>
              </div>

              {/* Badges Container */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-1.5">
                {feature.badges.map((badge, bIdx) => (
                  <span 
                    key={bIdx}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
