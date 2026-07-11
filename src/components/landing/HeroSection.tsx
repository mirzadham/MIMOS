"use client";

import Link from "next/link";
import LatticeNetwork from "./LatticeNetwork";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const backgrounds = [
  {
    url: "https://pub-133d71eacaef40c39b59eb43e5ded3ce.r2.dev/hero/khtp.png",
    fallback: "/images/khtp.png",
    alt: "Kulim Hi-Tech Park MIMOS Facility",
  },
  {
    url: "https://pub-133d71eacaef40c39b59eb43e5ded3ce.r2.dev/hero/tpm.png",
    fallback: "/images/tpm.png",
    alt: "Technology Park Malaysia Bukit Jalil MIMOS Facility",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSources, setImageSources] = useState(backgrounds.map((bg) => bg.url));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000); // Slide changes automatically every 6 seconds
    return () => clearInterval(timer);
  }, []);

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
    <section className="relative overflow-hidden border-b border-slate-900 min-h-[650px] h-screen flex items-center bg-slate-950 text-white">
      {/* Background Slideshow Layers */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={imageSources[idx]}
              alt={bg.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-right"
              onError={() => {
                setImageSources((prev) => {
                  const next = [...prev];
                  next[idx] = bg.fallback;
                  return next;
                });
              }}
            />
          </div>
        ))}
        
        {/* Asymmetric left-to-right gradient to ensure text readability on the left while keeping the building on the right bright and visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 via-[25%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
      </div>

      {/* Background Interactive Lattice - Overlaid with low opacity for a modern tech vibe */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
        <LatticeNetwork />
      </div>
      
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 text-left w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8 max-w-2xl"
        >
          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.08] lg:leading-[1.05]"
          >
            Driving Malaysia’s <br className="hidden sm:inline" />
            <span className="text-primary">
              High-Tech Excellence
            </span>{" "}
            In Talent
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl text-sm sm:text-lg text-slate-300 leading-relaxed font-body"
          >
            Empowering talent for Malaysia’s high-tech future — bridging education and industry for a ready workforce.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="pt-4 flex flex-wrap justify-start gap-4"
          >
            <Link
              href="/programs"
              className="rounded-lg bg-primary px-8 py-4 text-xs font-semibold text-white hover:bg-primary-hover transition-all flex items-center gap-2 group cursor-pointer shadow-lg shadow-primary/20"
            >
              <span>Explore Our Programmes</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/contact"
              className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom subtle edge grid line detail */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
    </section>
  );
}
