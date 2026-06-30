"use client";

import React from "react";
import { BookOpen, Users, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="border-b border-slate-200/60 bg-background py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-none bg-primary/3 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-none border border-primary/10">
            Academy Advantages
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Bridging Education and Industry Excellence
          </h2>
          <p className="text-sm sm:text-md text-slate-600 leading-relaxed font-body">
            MIMOS Academy integrates state-of-the-art laboratory infrastructure with national applied researchers to offer talent upskilling tracks that stand out globally.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {/* Card 1: Interactive Learning Approach (Colspan 2) */}
          <motion.div 
            variants={itemVariants}
            className="group md:col-span-2 relative rounded-none border border-slate-200/80 bg-white p-8 sm:p-10 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-none bg-slate-50 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-primary/5 border border-primary/10 text-primary">
                <BookOpen className="h-5.5 w-5.5" />
              </div>
              
              <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                Applied Learning & Lab Research
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                Engage in hands-on, immersive learning experiences designed to enhance technical capabilities. Our coursework takes place in real R&D environments, ensuring students develop practical, industrial-ready expertise that matches standard developer workflows.
              </p>
            </div>

            {/* Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {["C Programming", "Python", "Semiconductor Cleanroom Labs", "Advanced Math", "5G Edge Architecture"].map((badge, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center rounded-none bg-slate-50 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-600 group-hover:border-primary/10 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Experienced Instructors */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-none border border-slate-200/80 bg-white p-8 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-primary/5 border border-primary/10 text-primary">
                <Users className="h-5.5 w-5.5" />
              </div>
              
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Research Mentorship
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                Learn directly from MIMOS senior research scientists and engineers with decades of practical expertise in wafer fabrication, microelectronics, IC design, and enterprise-grade software development.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {["Wafer Fab Specialists", "R&D Mentors", "IC Designers"].map((badge, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center rounded-none bg-slate-50 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-600 group-hover:border-primary/10 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Industry Accreditation */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-none border border-slate-200/80 bg-white p-8 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-primary/5 border border-primary/10 text-primary">
                <Award className="h-5.5 w-5.5" />
              </div>
              
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Accredited Credentials
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                Earn industry-recognized, accredited certifications backed by Malaysia&apos;s National Applied R&D Centre. Boost your career authority and credentials with HRD Corp claimable modules.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {["HRD Corp Claimable", "National R&D Badge", "Accredited"].map((badge, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center rounded-none bg-slate-50 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-600 group-hover:border-primary/10 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Global Standards & Tech Impact (Colspan 2) */}
          <motion.div 
            variants={itemVariants}
            className="group md:col-span-2 relative rounded-none border border-slate-200/80 bg-white p-8 sm:p-10 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-primary/5 border border-primary/10 text-primary">
                <Globe className="h-5.5 w-5.5" />
              </div>
              
              <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                National Technology Infrastructure
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                Our facilities provide access to real industrial environments. Walk through our Semiconductor Cleanrooms, explore our 5G Demonstration Labs, and run machine learning algorithms on supercomputing systems. This level of physical training environment cannot be replicated in a standard academic classroom.
              </p>
            </div>

            {/* Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {["Semiconductor Lab", "5G Innovation Centre", "Supercomputer Access", "National R&D Infrastructure"].map((badge, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center rounded-none bg-slate-50 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-600 group-hover:border-primary/10 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
