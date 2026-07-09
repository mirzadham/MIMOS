"use client";

import Link from "next/link";
import LatticeNetwork from "./LatticeNetwork";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 py-24 sm:py-36 bg-gradient-to-br from-primary/5 via-slate-50 to-slate-50">
      {/* Background Interactive Lattice */}
      <LatticeNetwork />
      
      {/* Decorative gradient blur in background */}
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-[150px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="mx-auto max-w-5xl font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-[1.08] lg:leading-[1.05]"
          >
            Driving Malaysia’s <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent group-hover:to-primary transition-all duration-300">
              High-Tech Excellence
            </span>{" "}
            in R&D Talent
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-3xl text-sm sm:text-lg text-slate-500 leading-relaxed font-body"
          >
            Empowering engineers for Malaysia’s high-tech future. We bridge industry and advanced R&D by providing hands-on upskilling programmes inside national research laboratories.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/programs"
              className="rounded-lg bg-primary px-8 py-4 text-xs font-semibold text-white hover:bg-primary-hover transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Our Programmes</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/contact"
              className="rounded-lg border border-slate-250 bg-white px-8 py-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              Contact Advisory Team
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Grid line separator detail */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}
