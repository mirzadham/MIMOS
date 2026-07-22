"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import FacilityFeatureRow, { Facility } from "@/components/facilities/FacilityFeatureRow";
import FacilityImageCard from "@/components/facilities/FacilityImageCard";
import FacilityLightboxModal from "@/components/facilities/FacilityLightboxModal";

interface FacilitiesClientPageProps {
  facilities: Facility[];
}

export default function FacilitiesClientPage({ facilities }: FacilitiesClientPageProps) {
  // Parallax Scroll-Driven Ambient Lighting
  const { scrollYProgress } = useScroll();
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0px", "350px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["0px", "-250px"]);

  // Lightbox Modal state
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const handleOpenLightbox = (src: string, title: string, subtitle: string) => {
    setSelectedImage({ src, title, subtitle });
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-background text-slate-900 min-h-screen relative font-sans overflow-x-hidden">
      {/* Dynamic Parallax Scroll-Driven Ambient Lighting Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          style={{ y: orb1Y }}
          className="absolute right-1/4 top-10 h-[450px] w-[450px] rounded-full bg-primary/5 blur-[140px]"
        />
        <motion.div
          style={{ y: orb2Y }}
          className="absolute left-1/4 top-[800px] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[140px]"
        />
      </div>

      {/* Top Padding for Fixed Navigation Header */}
      <div className="h-20 w-full" aria-hidden="true" />

      {/* Hero Section Showcase */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-16 sm:pt-24 sm:pb-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl"
        >
          {/* Main Display Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-semibold uppercase tracking-tight text-slate-900 leading-none">
            Applied R&amp;D <br />
            Environments
          </h1>

          {/* Detailed Paragraph */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-body">
            MIMOS Academy is situated inside the national MIMOS Berhad headquarters, featuring direct shared access to Malaysia&apos;s leading applied research laboratories, wafer fab cleanrooms, and advanced testing environments.
          </p>
        </motion.div>

        {/* Hero Visual Card with 3D Tilt & Lightbox Modal Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl mt-12"
        >
          <FacilityImageCard
            src="/semiconductor_cleanroom.png"
            alt="MIMOS Applied R&D Facilities & Cleanrooms"
            title="Semiconductor Cleanroom Facilities"
            subtitle="BUKIT JALIL // HEADQUARTERS"
            aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
            priority
            onImageClick={handleOpenLightbox}
          />
        </motion.div>
      </section>

      {/* Alternating Feature Showcase Rows with Staggered Specs & 3D Tilt */}
      <div className="relative z-10">
        {facilities && facilities.length > 0 ? (
          facilities.map((fac, idx) => (
            <FacilityFeatureRow
              key={fac.id}
              facility={fac}
              rowIndex={idx}
              onImageClick={handleOpenLightbox}
            />
          ))
        ) : (
          <div className="py-24 text-center text-slate-400 font-sans text-sm">
            No facilities currently listed.
          </div>
        )}
      </div>

      {/* Bottom CTA Section - Ultra-Thin Razor Edge Gaps & High-Radius Rounded Corners */}
      <div className="mx-[2px] sm:mx-[4px] lg:mx-[6px] mt-16 sm:mt-24 mb-2 sm:mb-4 relative z-10 max-w-[calc(100%-8px)] mx-auto">
        <section className="bg-slate-950 text-center py-16 sm:py-24 px-6 sm:px-12 rounded-[48px] sm:rounded-[64px] md:rounded-[80px] border border-slate-800/80 relative overflow-hidden">
          {/* Subtle Gradient Top Border Line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Ambient Lighting Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute left-1/2 -top-24 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-primary/25 blur-[120px]" />
            <div className="absolute right-10 bottom-0 h-[250px] w-[250px] rounded-full bg-cyan-500/20 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-3xl space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white uppercase leading-tight font-heading">
              Gain direct learning access to our industry-standard labs and premium training environments.
            </h2>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-xs font-sans tracking-widest text-white uppercase font-semibold hover:bg-primary-hover hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/30"
              >
                Get in Touch
              </Link>
              <Link
                href="/programs"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700/80 px-8 text-xs font-sans tracking-widest text-slate-200 uppercase font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Programmes
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      <FacilityLightboxModal
        imageData={selectedImage}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
